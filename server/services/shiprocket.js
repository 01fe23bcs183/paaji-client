/**
 * Shiprocket Integration Service
 * Complete shipping solution for JMC Skincare
 */

import axios from 'axios';

class ShiprocketService {
    constructor() {
        this.baseURL = 'https://apiv2.shiprocket.in/v1/external';
        this.token = null;
        this.tokenExpiry = null;
    }

    // Authenticate with Shiprocket
    async authenticate() {
        try {
            // Check if token is still valid
            if (this.token && this.tokenExpiry && new Date() < this.tokenExpiry) {
                return this.token;
            }

            const response = await axios.post(`${this.baseURL}/auth/login`, {
                email: process.env.SHIPROCKET_EMAIL,
                password: process.env.SHIPROCKET_PASSWORD,
            });

            this.token = response.data.token;
            // Token valid for 10 days, we'll refresh after 9
            this.tokenExpiry = new Date(Date.now() + 9 * 24 * 60 * 60 * 1000);

            return this.token;
        } catch (error) {
            console.error('Shiprocket authentication failed:', error.message);
            throw new Error('Failed to authenticate with Shiprocket');
        }
    }

    // Get authenticated headers
    async getHeaders() {
        const token = await this.authenticate();
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        };
    }

    // Create order in Shiprocket
    async createOrder(orderData) {
        try {
            const headers = await this.getHeaders();

            const shiprocketOrder = {
                order_id: orderData.orderId,
                order_date: new Date().toISOString().split('T')[0],
                pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION || 'Primary',
                channel_id: process.env.SHIPROCKET_CHANNEL_ID,
                billing_customer_name: orderData.customerName,
                billing_last_name: orderData.customerLastName || '',
                billing_address: orderData.address.line1,
                billing_address_2: orderData.address.line2 || '',
                billing_city: orderData.address.city,
                billing_pincode: orderData.address.pincode,
                billing_state: orderData.address.state,
                billing_country: orderData.address.country || 'India',
                billing_email: orderData.email,
                billing_phone: orderData.phone,
                shipping_is_billing: true,
                order_items: orderData.items.map(item => ({
                    name: item.name,
                    sku: item.sku || `SKU-${item.productId}`,
                    units: item.quantity,
                    selling_price: item.price,
                    discount: item.discount || 0,
                    tax: item.tax || 0,
                    hsn: item.hsn || 330499, // Default HSN for cosmetics
                })),
                payment_method: orderData.paymentMethod === 'cod' ? 'COD' : 'Prepaid',
                sub_total: orderData.subtotal,
                length: orderData.packageDimensions?.length || 20,
                breadth: orderData.packageDimensions?.breadth || 15,
                height: orderData.packageDimensions?.height || 10,
                weight: orderData.packageDimensions?.weight || 0.5,
            };

            const response = await axios.post(
                `${this.baseURL}/orders/create/adhoc`,
                shiprocketOrder,
                { headers }
            );

            return {
                success: true,
                shiprocketOrderId: response.data.order_id,
                shipmentId: response.data.shipment_id,
                status: response.data.status,
                message: response.data.message,
            };
        } catch (error) {
            console.error('Shiprocket create order failed:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Failed to create Shiprocket order');
        }
    }

    // Generate AWB (Air Waybill) for shipment
    async generateAWB(shipmentId, courierId) {
        try {
            const headers = await this.getHeaders();

            const response = await axios.post(
                `${this.baseURL}/courier/assign/awb`,
                {
                    shipment_id: shipmentId,
                    courier_id: courierId,
                },
                { headers }
            );

            return {
                success: true,
                awbCode: response.data.response.data.awb_code,
                courierId: response.data.response.data.courier_company_id,
                courierName: response.data.response.data.courier_name,
            };
        } catch (error) {
            console.error('Shiprocket AWB generation failed:', error.response?.data || error.message);
            throw new Error('Failed to generate AWB');
        }
    }

    // Get available courier partners
    async getAvailableCouriers(pickupPincode, deliveryPincode, weight, cod = false) {
        try {
            const headers = await this.getHeaders();

            const response = await axios.get(
                `${this.baseURL}/courier/serviceability/`,
                {
                    headers,
                    params: {
                        pickup_postcode: pickupPincode,
                        delivery_postcode: deliveryPincode,
                        weight: weight,
                        cod: cod ? 1 : 0,
                    },
                }
            );

            return response.data.data.available_courier_companies.map(courier => ({
                id: courier.courier_company_id,
                name: courier.courier_name,
                rate: courier.rate,
                etd: courier.etd,
                estimatedDelivery: courier.estimated_delivery_days,
                codCharges: courier.cod_charges,
                isCodAvailable: courier.cod === 1,
            }));
        } catch (error) {
            console.error('Shiprocket courier check failed:', error.response?.data || error.message);
            return [];
        }
    }

    // Schedule pickup
    async schedulePickup(shipmentId, pickupDate) {
        try {
            const headers = await this.getHeaders();

            const response = await axios.post(
                `${this.baseURL}/courier/generate/pickup`,
                {
                    shipment_id: [shipmentId],
                    pickup_date: pickupDate || new Date().toISOString().split('T')[0],
                },
                { headers }
            );

            return {
                success: true,
                pickupStatus: response.data.pickup_status,
                pickupScheduledDate: response.data.pickup_scheduled_date,
                pickupTokenNumber: response.data.pickup_token_number,
            };
        } catch (error) {
            console.error('Shiprocket pickup schedule failed:', error.response?.data || error.message);
            throw new Error('Failed to schedule pickup');
        }
    }

    // Track shipment
    async trackShipment(awbCode) {
        try {
            const headers = await this.getHeaders();

            const response = await axios.get(
                `${this.baseURL}/courier/track/awb/${awbCode}`,
                { headers }
            );

            const trackingData = response.data.tracking_data;

            return {
                success: true,
                currentStatus: trackingData.shipment_status,
                currentStatusId: trackingData.shipment_status_id,
                awbCode: trackingData.awb_code,
                courierName: trackingData.courier_name,
                origin: trackingData.origin,
                destination: trackingData.destination,
                deliveredDate: trackingData.delivered_date,
                trackingHistory: trackingData.shipment_track?.map(track => ({
                    date: track.date,
                    time: track.time,
                    status: track.activity,
                    location: track.location,
                })) || [],
            };
        } catch (error) {
            console.error('Shiprocket tracking failed:', error.response?.data || error.message);
            throw new Error('Failed to track shipment');
        }
    }

    // Track by order ID
    async trackByOrderId(orderId) {
        try {
            const headers = await this.getHeaders();

            const response = await axios.get(
                `${this.baseURL}/courier/track`,
                {
                    headers,
                    params: { order_id: orderId },
                }
            );

            return response.data;
        } catch (error) {
            console.error('Shiprocket order tracking failed:', error.response?.data || error.message);
            throw new Error('Failed to track order');
        }
    }

    // Cancel shipment
    async cancelShipment(awbCodes) {
        try {
            const headers = await this.getHeaders();

            const response = await axios.post(
                `${this.baseURL}/orders/cancel/shipment/awbs`,
                { awbs: Array.isArray(awbCodes) ? awbCodes : [awbCodes] },
                { headers }
            );

            return {
                success: true,
                message: response.data.message,
            };
        } catch (error) {
            console.error('Shiprocket cancel shipment failed:', error.response?.data || error.message);
            throw new Error('Failed to cancel shipment');
        }
    }

    // Get shipping label
    async getLabel(shipmentId) {
        try {
            const headers = await this.getHeaders();

            const response = await axios.post(
                `${this.baseURL}/courier/generate/label`,
                { shipment_id: [shipmentId] },
                { headers }
            );

            return {
                success: true,
                labelUrl: response.data.label_url,
            };
        } catch (error) {
            console.error('Shiprocket label generation failed:', error.response?.data || error.message);
            throw new Error('Failed to generate label');
        }
    }

    // Get invoice
    async getInvoice(orderIds) {
        try {
            const headers = await this.getHeaders();

            const response = await axios.post(
                `${this.baseURL}/orders/print/invoice`,
                { ids: Array.isArray(orderIds) ? orderIds : [orderIds] },
                { headers }
            );

            return {
                success: true,
                invoiceUrl: response.data.invoice_url,
            };
        } catch (error) {
            console.error('Shiprocket invoice generation failed:', error.response?.data || error.message);
            throw new Error('Failed to generate invoice');
        }
    }

    // Get manifest
    async getManifest(shipmentIds) {
        try {
            const headers = await this.getHeaders();

            const response = await axios.post(
                `${this.baseURL}/manifests/generate`,
                { shipment_id: Array.isArray(shipmentIds) ? shipmentIds : [shipmentIds] },
                { headers }
            );

            return {
                success: true,
                manifestUrl: response.data.manifest_url,
            };
        } catch (error) {
            console.error('Shiprocket manifest generation failed:', error.response?.data || error.message);
            throw new Error('Failed to generate manifest');
        }
    }

    // Check pincode serviceability
    async checkServiceability(pincode) {
        try {
            const headers = await this.getHeaders();

            const response = await axios.get(
                `${this.baseURL}/open/postcode/details`,
                {
                    headers,
                    params: { postcode: pincode },
                }
            );

            return {
                success: true,
                city: response.data.postcode_details.city,
                state: response.data.postcode_details.state,
                district: response.data.postcode_details.district,
            };
        } catch (error) {
            return { success: false, error: 'Pincode not serviceable' };
        }
    }

    // Get NDR (Non-Delivery Report) shipments
    async getNDRShipments() {
        try {
            const headers = await this.getHeaders();

            const response = await axios.get(
                `${this.baseURL}/ndr/all`,
                { headers }
            );

            return response.data.data || [];
        } catch (error) {
            console.error('Shiprocket NDR fetch failed:', error.response?.data || error.message);
            return [];
        }
    }

    // Request return
    async createReturn(orderId, reason) {
        try {
            const headers = await this.getHeaders();

            const response = await axios.post(
                `${this.baseURL}/orders/create/return`,
                {
                    order_id: orderId,
                    return_reason: reason,
                },
                { headers }
            );

            return {
                success: true,
                returnOrderId: response.data.order_id,
                message: response.data.message,
            };
        } catch (error) {
            console.error('Shiprocket return creation failed:', error.response?.data || error.message);
            throw new Error('Failed to create return');
        }
    }
}

export default new ShiprocketService();
