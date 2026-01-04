import { useState, useEffect } from 'react';
import { FiDownload, FiX, FiSmartphone } from 'react-icons/fi';

const InstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        // Check if already dismissed this session
        const wasDismissed = sessionStorage.getItem('pwa_install_dismissed');
        if (wasDismissed) {
            setDismissed(true);
        }

        // Check for iOS
        const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        setIsIOS(iOS);

        // Check if already installed
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        if (isStandalone) {
            return;
        }

        // Listen for beforeinstallprompt event (Chrome, Edge, etc.)
        const handleBeforeInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);

            // Show prompt after a delay
            setTimeout(() => {
                setShowPrompt(true);
            }, 5000); // Show after 5 seconds
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // For iOS, show after delay
        if (iOS && !wasDismissed) {
            setTimeout(() => {
                setShowPrompt(true);
            }, 10000); // Show after 10 seconds on iOS
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) {
            // iOS - just close the prompt (user needs to use Share > Add to Home Screen)
            setShowPrompt(false);
            return;
        }

        // Show native install prompt
        deferredPrompt.prompt();

        const { outcome } = await deferredPrompt.userChoice;
        console.log('[PWA] Install prompt outcome:', outcome);

        setDeferredPrompt(null);
        setShowPrompt(false);
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        setDismissed(true);
        sessionStorage.setItem('pwa_install_dismissed', 'true');
    };

    if (!showPrompt || dismissed) return null;

    return (
        <>
            <style>
                {`
          .install-prompt {
            position: fixed;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 9998;
            width: calc(100% - 32px);
            max-width: 400px;
            background: var(--color-background);
            border-radius: var(--radius-lg);
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
            overflow: hidden;
            animation: slideUp 0.3s ease;
          }
          
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateX(-50%) translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateX(-50%) translateY(0);
            }
          }
          
          .install-prompt-header {
            background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
            padding: var(--spacing-md);
            color: white;
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);
          }
          
          .install-prompt-body {
            padding: var(--spacing-lg);
          }
          
          .install-prompt-actions {
            display: flex;
            gap: var(--spacing-sm);
            margin-top: var(--spacing-md);
          }
          
          .install-prompt-close {
            position: absolute;
            top: 12px;
            right: 12px;
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 4px;
            opacity: 0.8;
          }
          
          .install-prompt-close:hover {
            opacity: 1;
          }
          
          .ios-instructions {
            background: var(--color-background-alt);
            padding: var(--spacing-md);
            border-radius: var(--radius-md);
            margin-top: var(--spacing-md);
          }
          
          .ios-instructions ol {
            margin: 0;
            padding-left: var(--spacing-lg);
          }
          
          .ios-instructions li {
            margin-bottom: var(--spacing-xs);
          }
        `}
            </style>

            <div className="install-prompt">
                <button className="install-prompt-close" onClick={handleDismiss}>
                    <FiX size={20} />
                </button>

                <div className="install-prompt-header">
                    <FiSmartphone size={24} />
                    <span style={{ fontWeight: '600' }}>Install JMC Skincare App</span>
                </div>

                <div className="install-prompt-body">
                    <p style={{ marginBottom: 'var(--spacing-sm)' }}>
                        Install our app for a better shopping experience:
                    </p>
                    <ul style={{
                        paddingLeft: 'var(--spacing-lg)',
                        margin: 0,
                        fontSize: '0.9rem',
                        color: 'var(--color-text-muted)',
                    }}>
                        <li>⚡ Faster loading times</li>
                        <li>📱 Works offline</li>
                        <li>🔔 Get order updates</li>
                        <li>🏠 Easy access from home screen</li>
                    </ul>

                    {isIOS && (
                        <div className="ios-instructions">
                            <p style={{
                                fontWeight: '600',
                                marginBottom: 'var(--spacing-sm)',
                                fontSize: '0.9rem',
                            }}>
                                To install on iOS:
                            </p>
                            <ol style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>
                                <li>Tap the Share button <span style={{ fontSize: '1.1rem' }}>⬆️</span></li>
                                <li>Scroll and tap "Add to Home Screen"</li>
                                <li>Tap "Add" to confirm</li>
                            </ol>
                        </div>
                    )}

                    <div className="install-prompt-actions">
                        {!isIOS && (
                            <button onClick={handleInstall} className="btn btn-primary" style={{ flex: 1 }}>
                                <FiDownload /> Install App
                            </button>
                        )}
                        <button onClick={handleDismiss} className="btn btn-outline" style={{ flex: isIOS ? 1 : 'unset' }}>
                            {isIOS ? 'Got it!' : 'Maybe Later'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default InstallPrompt;
