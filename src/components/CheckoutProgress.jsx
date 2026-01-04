import { FiShoppingCart, FiTruck, FiCreditCard, FiCheck } from 'react-icons/fi';

const CheckoutProgress = ({ currentStep = 1 }) => {
    const steps = [
        { id: 1, label: 'Cart', icon: FiShoppingCart },
        { id: 2, label: 'Shipping', icon: FiTruck },
        { id: 3, label: 'Payment', icon: FiCreditCard },
        { id: 4, label: 'Complete', icon: FiCheck },
    ];

    const containerStyle = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 'var(--spacing-lg) var(--spacing-md)',
        background: 'var(--color-background)',
        borderBottom: '1px solid var(--color-border)',
        marginBottom: 'var(--spacing-lg)',
    };

    const progressWrapperStyle = {
        display: 'flex',
        alignItems: 'center',
        maxWidth: '600px',
        width: '100%',
    };

    const getStepStyle = (stepId) => {
        const isCompleted = stepId < currentStep;
        const isCurrent = stepId === currentStep;
        const isUpcoming = stepId > currentStep;

        return {
            step: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                flex: 1,
            },
            circle: {
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isCompleted
                    ? 'var(--color-primary)'
                    : isCurrent
                        ? 'var(--color-primary)'
                        : 'var(--color-background-alt)',
                border: `2px solid ${isCompleted || isCurrent ? 'var(--color-primary)' : 'var(--color-border)'}`,
                color: isCompleted || isCurrent ? 'white' : 'var(--color-text-muted)',
                transition: 'all 0.3s ease',
                boxShadow: isCurrent ? '0 0 0 4px rgba(196, 167, 125, 0.2)' : 'none',
            },
            label: {
                marginTop: 'var(--spacing-xs)',
                fontSize: '0.75rem',
                fontWeight: isCurrent ? '600' : '400',
                color: isCompleted || isCurrent ? 'var(--color-text)' : 'var(--color-text-muted)',
                textAlign: 'center',
            },
            connector: {
                flex: 1,
                height: '3px',
                background: isCompleted
                    ? 'var(--color-primary)'
                    : 'var(--color-border)',
                margin: '0 var(--spacing-xs)',
                marginBottom: '20px',
                borderRadius: '2px',
                transition: 'all 0.3s ease',
            },
        };
    };

    return (
        <div style={containerStyle} className="checkout-progress">
            <div style={progressWrapperStyle}>
                {steps.map((step, index) => {
                    const styles = getStepStyle(step.id);
                    const Icon = step.icon;
                    const isCompleted = step.id < currentStep;

                    return (
                        <div key={step.id} style={{ display: 'flex', alignItems: 'flex-start', flex: 1 }}>
                            <div style={styles.step}>
                                <div style={styles.circle}>
                                    {isCompleted ? <FiCheck size={18} /> : <Icon size={18} />}
                                </div>
                                <span style={styles.label}>{step.label}</span>
                            </div>
                            {index < steps.length - 1 && (
                                <div style={styles.connector} />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CheckoutProgress;
