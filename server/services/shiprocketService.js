import axios from 'axios';

class ShiprocketService {
    constructor() {
        this.baseURL = 'https://apiv2.shiprocket.in/v1/external';
        this.email = process.env.SHIPROCKET_EMAIL;
        this.password = process.env.SHIPROCKET_PASSWORD;
        this.token = null;
        this.tokenExpiry = null;
    }

    // Authenticate and get token
    async authenticate() {
        try {
            // Check if token is still valid
            if (this.token && this.tokenExpiry && new Date() < this.tokenExpiry) {
                return this.token;
            }

            const response = await axios.post(`${this.baseURL}/auth/login`, {
                email: this.email,
                password: this.password
            });

            this.token = response.data.token;
            // Token expires in 10 days, refresh before that
            this.tokenExpiry = new Date(Date.now() + 9 * 24 * 60 * 60 * 1000);

            console.log('✅ Shiprocket authenticated successfully');
            return this.token;
        } catch (error) {
            console.error('❌ Shiprocket authentication failed:', error.response?.data || error.message);
            throw new Error('Failed to authenticate with Shiprocket');
        }
    }

    // Get authenticated headers
    async getHeaders() {
        const token = await this.authenticate();
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    }

    // Create a shipment order
    async createOrder(orderData) {
        try {
            const headers = await this.getHeaders();

            const shiprocketOrder = {
                order_id: orderData.orderNumber,
                order_date: new Date().toISOString().split('T')[0],
                pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION || 'Primary',
                billing_customer_name: orderData.customer.name,
                billing_last_name: '',
                billing_address: orderData.customer.address,
                billing_city: orderData.customer.city,
                billing_pincode: orderData.customer.pincode,
                billing_state: orderData.customer.state,
                billing_country: 'India',
                billing_email: orderData.customer.email,
                billing_phone: orderData.customer.phone,
                shipping_is_billing: true,
                order_items: orderData.items.map(item => ({
                    name: item.name,
                    sku: item.productId || item.name.replace(/\s+/g, '-').toLowerCase(),
                    units: item.quantity,
                    selling_price: item.price,
                    discount: 0,
                    tax: 0
                })),
                payment_method: orderData.paymentMethod === 'cod' ? 'COD' : 'Prepaid',
                sub_total: orderData.subtotal,
                length: 10, // Package dimensions (customize as needed)
                breadth: 10,
                height: 5,
                weight: 0.5
            };

            const response = await axios.post(
                `${this.baseURL}/orders/create/adhoc`,
                shiprocketOrder,
                { headers }
            );

            console.log(`✅ Shiprocket order created: ${response.data.order_id}`);
            return {
                success: true,
                shiprocketOrderId: response.data.order_id,
                shipmentId: response.data.shipment_id,
                data: response.data
            };
        } catch (error) {
            console.error('❌ Shiprocket order creation failed:', error.response?.data || error.message);
            return {
                success: false,
                error: error.response?.data?.message || error.message
            };
        }
    }

    // Generate AWB (Air Waybill) number
    async generateAWB(shipmentId, courierId) {
        try {
            const headers = await this.getHeaders();

            const response = await axios.post(
                `${this.baseURL}/courier/assign/awb`,
                {
                    shipment_id: shipmentId,
                    courier_id: courierId
                },
                { headers }
            );

            console.log(`✅ AWB generated for shipment ${shipmentId}`);
            return {
                success: true,
                awb: response.data.response.data.awb_code,
                data: response.data
            };
        } catch (error) {
            console.error('❌ AWB generation failed:', error.response?.data || error.message);
            return {
                success: false,
                error: error.response?.data?.message || error.message
            };
        }
    }

    // Get available courier services for a shipment
    async getCourierServices(shipmentId) {
        try {
            const headers = await this.getHeaders();

            const response = await axios.get(
                `${this.baseURL}/courier/serviceability/?shipment_id=${shipmentId}`,
                { headers }
            );

            return {
                success: true,
                couriers: response.data.data.available_courier_companies
            };
        } catch (error) {
            console.error('❌ Failed to get courier services:', error.response?.data || error.message);
            return {
                success: false,
                error: error.response?.data?.message || error.message
            };
        }
    }

    // Track shipment
    async trackShipment(shipmentId) {
        try {
            const headers = await this.getHeaders();

            const response = await axios.get(
                `${this.baseURL}/courier/track/shipment/${shipmentId}`,
                { headers }
            );

            return {
                success: true,
                tracking: response.data.tracking_data
            };
        } catch (error) {
            console.error('❌ Shipment tracking failed:', error.response?.data || error.message);
            return {
                success: false,
                error: error.response?.data?.message || error.message
            };
        }
    }

    // Track by AWB number
    async trackByAWB(awb) {
        try {
            const headers = await this.getHeaders();

            const response = await axios.get(
                `${this.baseURL}/courier/track/awb/${awb}`,
                { headers }
            );

            return {
                success: true,
                tracking: response.data.tracking_data
            };
        } catch (error) {
            console.error('❌ AWB tracking failed:', error.response?.data || error.message);
            return {
                success: false,
                error: error.response?.data?.message || error.message
            };
        }
    }

    // Generate shipping label
    async generateLabel(shipmentIds) {
        try {
            const headers = await this.getHeaders();

            const response = await axios.post(
                `${this.baseURL}/courier/generate/label`,
                {
                    shipment_id: Array.isArray(shipmentIds) ? shipmentIds : [shipmentIds]
                },
                { headers }
            );

            return {
                success: true,
                labelUrl: response.data.label_url,
                data: response.data
            };
        } catch (error) {
            console.error('❌ Label generation failed:', error.response?.data || error.message);
            return {
                success: false,
                error: error.response?.data?.message || error.message
            };
        }
    }

    // Generate manifest
    async generateManifest(shipmentIds) {
        try {
            const headers = await this.getHeaders();

            const response = await axios.post(
                `${this.baseURL}/manifests/generate`,
                {
                    shipment_id: Array.isArray(shipmentIds) ? shipmentIds : [shipmentIds]
                },
                { headers }
            );

            return {
                success: true,
                manifestUrl: response.data.manifest_url,
                data: response.data
            };
        } catch (error) {
            console.error('❌ Manifest generation failed:', error.response?.data || error.message);
            return {
                success: false,
                error: error.response?.data?.message || error.message
            };
        }
    }

    // Schedule pickup
    async schedulePickup(shipmentIds, pickupDate) {
        try {
            const headers = await this.getHeaders();

            const response = await axios.post(
                `${this.baseURL}/courier/generate/pickup`,
                {
                    shipment_id: Array.isArray(shipmentIds) ? shipmentIds : [shipmentIds],
                    pickup_date: pickupDate || new Date().toISOString().split('T')[0]
                },
                { headers }
            );

            return {
                success: true,
                pickupStatus: response.data.pickup_status,
                data: response.data
            };
        } catch (error) {
            console.error('❌ Pickup scheduling failed:', error.response?.data || error.message);
            return {
                success: false,
                error: error.response?.data?.message || error.message
            };
        }
    }

    // Cancel shipment
    async cancelShipment(shipmentIds) {
        try {
            const headers = await this.getHeaders();

            const response = await axios.post(
                `${this.baseURL}/orders/cancel`,
                {
                    ids: Array.isArray(shipmentIds) ? shipmentIds : [shipmentIds]
                },
                { headers }
            );

            return {
                success: true,
                data: response.data
            };
        } catch (error) {
            console.error('❌ Shipment cancellation failed:', error.response?.data || error.message);
            return {
                success: false,
                error: error.response?.data?.message || error.message
            };
        }
    }

    // Get shipping rates
    async getShippingRates(pickup_pincode, delivery_pincode, weight, cod = 0) {
        try {
            const headers = await this.getHeaders();

            const response = await axios.get(
                `${this.baseURL}/courier/serviceability/?pickup_postcode=${pickup_pincode}&delivery_postcode=${delivery_pincode}&weight=${weight}&cod=${cod}`,
                { headers }
            );

            return {
                success: true,
                rates: response.data.data.available_courier_companies
            };
        } catch (error) {
            console.error('❌ Failed to get shipping rates:', error.response?.data || error.message);
            return {
                success: false,
                error: error.response?.data?.message || error.message
            };
        }
    }
}

// Export singleton instance
const shiprocketService = new ShiprocketService();
export default shiprocketService;
