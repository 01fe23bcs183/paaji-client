import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizQuestions, analyzeSkinProfile } from '../data/quizData';
import { FiArrowRight, FiArrowLeft, FiCheck, FiShare2, FiMail } from 'react-icons/fi';
import SEO from '../components/SEO';

const SkinQuiz = () => {
    const navigate = useNavigate();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [results, setResults] = useState(null);
    const [animating, setAnimating] = useState(false);
    const [email, setEmail] = useState('');
    const [emailSaved, setEmailSaved] = useState(false);

    const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;

    const handleSelectOption = (questionId, optionId) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: optionId
        }));
    };

    const handleNext = () => {
        if (currentQuestion < quizQuestions.length - 1) {
            setAnimating(true);
            setTimeout(() => {
                setCurrentQuestion(prev => prev + 1);
                setAnimating(false);
            }, 300);
        } else {
            // Calculate results
            const analysisResults = analyzeSkinProfile(answers);
            setResults(analysisResults);
            setShowResults(true);
        }
    };

    const handleBack = () => {
        if (currentQuestion > 0) {
            setAnimating(true);
            setTimeout(() => {
                setCurrentQuestion(prev => prev - 1);
                setAnimating(false);
            }, 300);
        }
    };

    const handleSaveEmail = () => {
        if (email) {
            // Save results with email
            const savedResults = {
                email,
                results,
                savedAt: new Date().toISOString(),
            };
            localStorage.setItem('quiz_results', JSON.stringify(savedResults));
            setEmailSaved(true);
        }
    };

    const currentQ = quizQuestions[currentQuestion];
    const currentAnswer = answers[currentQ?.id];

    if (showResults && results) {
        return (
            <div className="section" style={{ paddingTop: '100px', minHeight: '100vh' }}>
                <div className="container" style={{ maxWidth: '900px' }}>
                    {/* Results Header */}
                    <div style={{
                        textAlign: 'center',
                        marginBottom: 'var(--spacing-xxl)',
                    }}>
                        <div style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto var(--spacing-lg)',
                            color: 'white',
                            fontSize: '3rem',
                        }}>
                            ✨
                        </div>
                        <h1 style={{ marginBottom: 'var(--spacing-sm)' }}>
                            Your Personalized Skin Analysis
                        </h1>
                        <p className="text-large text-muted">
                            Based on your answers, we've created a custom skincare routine just for you.
                        </p>
                    </div>

                    {/* Skin Score Card */}
                    <div className="card" style={{
                        marginBottom: 'var(--spacing-xl)',
                        overflow: 'hidden',
                    }}>
                        <div style={{
                            background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                            padding: 'var(--spacing-xl)',
                            color: 'white',
                            textAlign: 'center',
                        }}>
                            <h2 style={{ marginBottom: 'var(--spacing-md)', color: 'white' }}>
                                Your Skin Health Score
                            </h2>
                            <div style={{
                                fontSize: '4rem',
                                fontWeight: '700',
                                marginBottom: 'var(--spacing-xs)',
                            }}>
                                {results.skinAnalysis.overallScore}/100
                            </div>
                            <p style={{ opacity: 0.9 }}>
                                {results.skinAnalysis.overallScore >= 70 ? 'Great foundation!' :
                                    results.skinAnalysis.overallScore >= 50 ? 'Room for improvement' :
                                        'Let\'s build your routine!'}
                            </p>
                        </div>
                        <div className="card-body" style={{ padding: 'var(--spacing-xl)' }}>
                            <div className="grid grid-cols-2 gap-lg">
                                <div>
                                    <h4 style={{ marginBottom: 'var(--spacing-sm)', color: 'var(--color-primary)' }}>
                                        Your Skin Type
                                    </h4>
                                    <p className="text-capitalize" style={{ fontWeight: '600', fontSize: '1.25rem' }}>
                                        {results.profile.skinType} Skin
                                    </p>
                                    <p className="text-muted text-small">
                                        {results.skinAnalysis.skinTypeAnalysis}
                                    </p>
                                </div>
                                <div>
                                    <h4 style={{ marginBottom: 'var(--spacing-sm)', color: 'var(--color-primary)' }}>
                                        Primary Concern
                                    </h4>
                                    <p className="text-capitalize" style={{ fontWeight: '600', fontSize: '1.25rem' }}>
                                        {results.profile.primaryConcern}
                                    </p>
                                    <p className="text-muted text-small">
                                        {results.skinAnalysis.concernAnalysis}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recommended Routine */}
                    <div className="grid grid-cols-2 gap-lg" style={{ marginBottom: 'var(--spacing-xl)' }}>
                        {/* Morning Routine */}
                        <div className="card">
                            <div className="card-header" style={{
                                background: '#FFF9E6',
                                borderBottom: '1px solid #FFE082',
                            }}>
                                <h3 style={{ marginBottom: 0, display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                                    ☀️ Morning Routine
                                </h3>
                            </div>
                            <div className="card-body">
                                {results.recommendations.morning.map((item, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            display: 'flex',
                                            gap: 'var(--spacing-md)',
                                            padding: 'var(--spacing-md) 0',
                                            borderBottom: index < results.recommendations.morning.length - 1
                                                ? '1px solid var(--color-border)'
                                                : 'none',
                                        }}
                                    >
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            background: 'var(--color-primary)',
                                            color: 'white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: '600',
                                            flexShrink: 0,
                                        }}>
                                            {item.step}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: '600', marginBottom: '2px' }}>
                                                {item.category}
                                                {item.importance === 'Essential' && (
                                                    <span style={{
                                                        fontSize: '0.7rem',
                                                        background: 'var(--color-success)',
                                                        color: 'white',
                                                        padding: '2px 6px',
                                                        borderRadius: '4px',
                                                        marginLeft: 'var(--spacing-xs)',
                                                    }}>
                                                        Essential
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-small text-muted" style={{ marginBottom: 0 }}>
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Evening Routine */}
                        <div className="card">
                            <div className="card-header" style={{
                                background: '#E8EAF6',
                                borderBottom: '1px solid #9FA8DA',
                            }}>
                                <h3 style={{ marginBottom: 0, display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                                    🌙 Evening Routine
                                </h3>
                            </div>
                            <div className="card-body">
                                {results.recommendations.evening.map((item, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            display: 'flex',
                                            gap: 'var(--spacing-md)',
                                            padding: 'var(--spacing-md) 0',
                                            borderBottom: index < results.recommendations.evening.length - 1
                                                ? '1px solid var(--color-border)'
                                                : 'none',
                                        }}
                                    >
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            background: 'var(--color-accent)',
                                            color: 'white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: '600',
                                            flexShrink: 0,
                                        }}>
                                            {item.step}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: '600', marginBottom: '2px' }}>
                                                {item.category}
                                                {item.importance === 'Essential' && (
                                                    <span style={{
                                                        fontSize: '0.7rem',
                                                        background: 'var(--color-success)',
                                                        color: 'white',
                                                        padding: '2px 6px',
                                                        borderRadius: '4px',
                                                        marginLeft: 'var(--spacing-xs)',
                                                    }}>
                                                        Essential
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-small text-muted" style={{ marginBottom: 0 }}>
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Weekly Treatments */}
                    <div className="card" style={{ marginBottom: 'var(--spacing-xl)' }}>
                        <div className="card-header">
                            <h3 style={{ marginBottom: 0 }}>📅 Weekly Treatments</h3>
                        </div>
                        <div className="card-body">
                            <div className="grid grid-cols-2 gap-lg">
                                {results.recommendations.weekly.map((item, index) => (
                                    <div
                                        key={index}
                                        style={{
                                            padding: 'var(--spacing-md)',
                                            background: 'var(--color-background-alt)',
                                            borderRadius: 'var(--radius-md)',
                                        }}
                                    >
                                        <div style={{ fontWeight: '600', marginBottom: 'var(--spacing-xs)' }}>
                                            {item.category}
                                        </div>
                                        <div style={{
                                            fontSize: '0.85rem',
                                            color: 'var(--color-primary)',
                                            marginBottom: 'var(--spacing-xs)',
                                        }}>
                                            {item.frequency}
                                        </div>
                                        <p className="text-small text-muted" style={{ marginBottom: 0 }}>
                                            {item.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Save Results */}
                    <div className="card" style={{
                        marginBottom: 'var(--spacing-xl)',
                        textAlign: 'center',
                        padding: 'var(--spacing-xl)',
                    }}>
                        {!emailSaved ? (
                            <>
                                <h3>Save Your Results</h3>
                                <p className="text-muted mb-lg">
                                    Enter your email to save your personalized routine and get skincare tips.
                                </p>
                                <div style={{
                                    display: 'flex',
                                    gap: 'var(--spacing-md)',
                                    maxWidth: '400px',
                                    margin: '0 auto',
                                }}>
                                    <input
                                        type="email"
                                        placeholder="Your email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="form-input"
                                        style={{ flex: 1 }}
                                    />
                                    <button onClick={handleSaveEmail} className="btn btn-primary">
                                        <FiMail /> Save
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div>
                                <div style={{
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '50%',
                                    background: 'var(--color-success)',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto var(--spacing-md)',
                                    fontSize: '1.5rem',
                                }}>
                                    <FiCheck />
                                </div>
                                <h3>Results Saved!</h3>
                                <p className="text-muted">
                                    We've saved your personalized routine. Check your email for skincare tips!
                                </p>
                            </div>
                        )}
                    </div>

                    {/* CTA Buttons */}
                    <div style={{
                        display: 'flex',
                        gap: 'var(--spacing-md)',
                        justifyContent: 'center',
                    }}>
                        <button
                            onClick={() => navigate('/')}
                            className="btn btn-primary btn-lg"
                        >
                            Shop Products For Your Skin
                        </button>
                        <button
                            onClick={() => {
                                setShowResults(false);
                                setCurrentQuestion(0);
                                setAnswers({});
                                setResults(null);
                            }}
                            className="btn btn-outline btn-lg"
                        >
                            Retake Quiz
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="section" style={{
            paddingTop: '100px',
            minHeight: '100vh',
            background: 'linear-gradient(180deg, var(--color-background) 0%, var(--color-background-alt) 100%)',
        }}>
            <SEO
                title="Skin Type Quiz"
                description="Take our 2-minute skin type quiz to get a personalized skincare routine. Discover products perfect for your skin type and concerns."
                keywords="skin type quiz, skincare quiz, personalized skincare, skin analysis, skincare routine"
                url="/skin-quiz"
            />
            <div className="container" style={{ maxWidth: '700px' }}>
                {/* Progress Bar */}
                <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: 'var(--spacing-sm)',
                    }}>
                        <span className="text-small text-muted">
                            Question {currentQuestion + 1} of {quizQuestions.length}
                        </span>
                        <span className="text-small text-muted">
                            {Math.round(progress)}% Complete
                        </span>
                    </div>
                    <div style={{
                        height: '8px',
                        background: 'var(--color-border)',
                        borderRadius: '4px',
                        overflow: 'hidden',
                    }}>
                        <div style={{
                            height: '100%',
                            width: `${progress}%`,
                            background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))',
                            transition: 'width 0.3s ease',
                            borderRadius: '4px',
                        }} />
                    </div>
                </div>

                {/* Question Card */}
                <div
                    className="card"
                    style={{
                        opacity: animating ? 0 : 1,
                        transform: animating ? 'translateX(20px)' : 'translateX(0)',
                        transition: 'all 0.3s ease',
                    }}
                >
                    <div className="card-body" style={{ padding: 'var(--spacing-xl)' }}>
                        <h2 style={{ marginBottom: 'var(--spacing-sm)' }}>
                            {currentQ?.question}
                        </h2>
                        <p className="text-muted mb-xl">
                            {currentQ?.description}
                        </p>

                        {/* Options */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 'var(--spacing-md)',
                        }}>
                            {currentQ?.options.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => handleSelectOption(currentQ.id, option.id)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 'var(--spacing-md)',
                                        padding: 'var(--spacing-md) var(--spacing-lg)',
                                        border: `2px solid ${currentAnswer === option.id ? 'var(--color-primary)' : 'var(--color-border)'}`,
                                        borderRadius: 'var(--radius-md)',
                                        background: currentAnswer === option.id ? 'rgba(196, 167, 125, 0.1)' : 'var(--color-background)',
                                        cursor: 'pointer',
                                        textAlign: 'left',
                                        transition: 'all 0.2s ease',
                                    }}
                                    onMouseEnter={(e) => {
                                        if (currentAnswer !== option.id) {
                                            e.currentTarget.style.borderColor = 'var(--color-primary)';
                                            e.currentTarget.style.background = 'rgba(196, 167, 125, 0.05)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (currentAnswer !== option.id) {
                                            e.currentTarget.style.borderColor = 'var(--color-border)';
                                            e.currentTarget.style.background = 'var(--color-background)';
                                        }
                                    }}
                                >
                                    <span style={{ fontSize: '2rem' }}>{option.icon}</span>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: '600', marginBottom: '2px' }}>
                                            {option.label}
                                        </div>
                                        <div className="text-small text-muted">
                                            {option.description}
                                        </div>
                                    </div>
                                    {currentAnswer === option.id && (
                                        <div style={{
                                            width: '24px',
                                            height: '24px',
                                            borderRadius: '50%',
                                            background: 'var(--color-primary)',
                                            color: 'white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                            <FiCheck size={14} />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="card-footer" style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: 'var(--spacing-lg) var(--spacing-xl)',
                        borderTop: '1px solid var(--color-border)',
                    }}>
                        <button
                            onClick={handleBack}
                            className="btn btn-outline"
                            disabled={currentQuestion === 0}
                            style={{ opacity: currentQuestion === 0 ? 0.5 : 1 }}
                        >
                            <FiArrowLeft /> Back
                        </button>
                        <button
                            onClick={handleNext}
                            className="btn btn-primary"
                            disabled={!currentAnswer}
                            style={{ opacity: !currentAnswer ? 0.5 : 1 }}
                        >
                            {currentQuestion === quizQuestions.length - 1 ? 'See Results' : 'Next'}
                            <FiArrowRight />
                        </button>
                    </div>
                </div>

                {/* Quiz Benefits */}
                <div style={{
                    marginTop: 'var(--spacing-xl)',
                    textAlign: 'center',
                }}>
                    <p className="text-small text-muted">
                        🔒 Your answers are private and help us personalize your skincare recommendations
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SkinQuiz;
