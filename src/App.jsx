import { useState } from 'react';

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    year: '',
    degree: '',
    class: '',
    gender: '',
    source: '',
    destination: '',
    plan: '',
    amount: 0
  });

  const [idData, setIdData] = useState({
    phone: '',
    aadhar: '',
    pdfFile: null
  });
  const [pdfPreview, setPdfPreview] = useState(null);

  const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby7pI3sOU_AfT2KBjavs-3sWez5XHnRT0u8kdLjXVuSaVPpPAwxYBQhZ7LLvdtRJWxR4g/exec';

  const handlePdfUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setIdData({ ...idData, pdfFile: file });
      const fileUrl = URL.createObjectURL(file);
      setPdfPreview(fileUrl);
    } else {
      alert('Please upload a valid PDF file');
    }
  };

  const submitToGoogleSheets = async () => {
    if (!idData.phone || !idData.aadhar || !idData.pdfFile) {
      alert('Please fill in all fields and upload the PDF document');
      return;
    }

    setIsSubmitting(true);
    try {
      const dataToSend = {
        email: email,
        name: formData.name,
        degree: formData.degree,
        year: formData.year,
        class: formData.class,
        gender: formData.gender,
        source: formData.source,
        destination: formData.destination,
        plan: formData.plan,
        amount: formData.amount,
        phone: idData.phone,
        aadhar: idData.aadhar
      };

      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend)
      });

      alert('Form submitted successfully!');
      setEmail('');
      setFormData({
        name: '',
        year: '',
        degree: '',
        class: '',
        gender: '',
        source: '',
        destination: '',
        plan: '',
        amount: 0
      });
      setIdData({
        phone: '',
        aadhar: '',
        pdfFile: null
      });
      setPdfPreview(null);
      setCurrentPage('login');
    } catch (error) {
      alert('Error submitting form. Please try again.');
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = () => {
    if (!email) {
      setEmailError('Email is required');
      return;
    }
    if (!email.endsWith('@somaiya.edu')) {
      setEmailError('Email must be a @somaiya.edu address');
      return;
    }
    setEmailError('');
    setCurrentPage('registration');
  };

  const handleRegistrationNext = () => {
    if (!formData.name || !formData.degree || !formData.year || !formData.class || 
        !formData.gender || !formData.source || !formData.destination || !formData.plan) {
      alert('Please fill in all fields before proceeding');
      return;
    }
    setCurrentPage('idcard');
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleIdChange = (e) => {
    setIdData({
      ...idData,
      [e.target.name]: e.target.value
    });
  };

  const styles = {
    loginContainer: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(to bottom right, #f9fafb, #e5e7eb, white)',
      position: 'relative',
      overflow: 'hidden'
    },
    loginBackground: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(to bottom right, rgba(219, 234, 254, 0.3), transparent, rgba(243, 232, 255, 0.3))'
    },
    loginTitle: {
      fontSize: '6rem',
      fontWeight: '200',
      color: '#111827',
      textAlign: 'center',
      marginBottom: '8rem',
      whiteSpace: 'nowrap',
      letterSpacing: '0.025em',
      position: 'relative',
      zIndex: 10
    },
    loginTitleGradient: {
      background: 'linear-gradient(to right, #2563eb, #111827, #2563eb)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    loginCard: {
      width: '100%',
      maxWidth: '48rem',
      padding: '2rem',
      position: 'relative',
      zIndex: 10
    },
    loginCardInner: {
      background: 'rgba(255, 255, 255, 0.4)',
      backdropFilter: 'blur(40px)',
      borderRadius: '24px',
      padding: '5rem',
      border: '1px solid rgba(229, 231, 235, 0.3)',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
    },
    loginHeading: {
      fontSize: '3rem',
      fontWeight: '300',
      color: '#111827',
      textAlign: 'center',
      marginBottom: '4rem',
      letterSpacing: '0.025em'
    },
    loginLabel: {
      display: 'block',
      fontSize: '1.125rem',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '1rem'
    },
    loginInput: {
      width: '100%',
      padding: '1.25rem 1.5rem',
      fontSize: '1.25rem',
      background: 'rgba(249, 250, 251, 0.3)',
      border: '1px solid rgba(209, 213, 219, 0.3)',
      borderRadius: '16px',
      outline: 'none',
      transition: 'all 0.3s',
      color: '#111827',
      boxSizing: 'border-box'
    },
    loginButton: {
      width: '100%',
      background: '#2563eb',
      color: 'white',
      fontWeight: '500',
      padding: '1.5rem',
      fontSize: '1.25rem',
      borderRadius: '16px',
      transition: 'all 0.3s',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      border: 'none',
      cursor: 'pointer'
    },
    regContainer: {
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #f8fafc, rgba(224, 242, 254, 0.3), white)'
    },
    regInner: {
      maxWidth: '80rem',
      margin: '0 auto',
      padding: '2rem 2rem 4rem'
    },
    regHeader: {
      textAlign: 'center',
      marginBottom: '4rem'
    },
    regTitle: {
      fontSize: '3.75rem',
      fontWeight: '300',
      color: '#0f172a',
      marginBottom: '1rem',
      letterSpacing: '-0.025em'
    },
    regSubtitle: {
      fontSize: '1.25rem',
      color: '#64748b',
      fontWeight: '300'
    },
    regCard: {
      background: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(40px)',
      borderRadius: '24px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      border: '1px solid rgba(226, 232, 240, 0.5)',
      padding: '3rem'
    },
    sectionTitle: {
      fontSize: '1.5rem',
      fontWeight: '500',
      color: '#1e293b',
      marginBottom: '1.5rem',
      paddingBottom: '0.75rem',
      borderBottom: '1px solid #e2e8f0'
    },
    label: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#475569',
      marginBottom: '0.5rem',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    },
    input: {
      width: '100%',
      padding: '1rem 1.25rem',
      fontSize: '1rem',
      background: '#f8fafc',
      border: '1px solid #cbd5e1',
      borderRadius: '12px',
      outline: 'none',
      transition: 'all 0.2s',
      color: '#0f172a',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      boxSizing: 'border-box'
    },
    button: {
      width: '100%',
      background: 'linear-gradient(to right, #2563eb, #1e40af)',
      color: 'white',
      fontWeight: '600',
      padding: '1.25rem',
      fontSize: '1.125rem',
      borderRadius: '12px',
      transition: 'all 0.3s',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      border: 'none',
      cursor: 'pointer'
    },
    buttonSecondary: {
      width: '100%',
      background: '#f1f5f9',
      color: '#475569',
      fontWeight: '600',
      padding: '1.25rem',
      fontSize: '1.125rem',
      borderRadius: '12px',
      transition: 'all 0.2s',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      border: 'none',
      cursor: 'pointer'
    },
    amountDisplay: {
      width: '100%',
      padding: '1rem 1.25rem',
      fontSize: '1rem',
      background: '#dbeafe',
      border: '2px solid #bfdbfe',
      borderRadius: '12px',
      color: '#0f172a',
      fontWeight: '600',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      boxSizing: 'border-box'
    },
    amountText: {
      fontSize: '1.5rem',
      color: '#1e40af'
    },
    idContainer: {
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #f8fafc, rgba(224, 242, 254, 0.3), white)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    },
    idInner: {
      maxWidth: '64rem',
      width: '100%'
    },
    idTitle: {
      fontSize: '3rem',
      fontWeight: '300',
      color: '#0f172a',
      textAlign: 'center',
      marginBottom: '3rem'
    },
    idCard: {
      background: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(40px)',
      borderRadius: '24px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      border: '1px solid rgba(226, 232, 240, 0.5)',
      padding: '2.5rem'
    },
    fileUploadLabel: {
      display: 'block',
      width: '100%',
      padding: '1rem',
      border: '2px dashed #cbd5e1',
      borderRadius: '12px',
      fontSize: '1rem',
      background: '#f8fafc',
      transition: 'all 0.2s',
      cursor: 'pointer',
      textAlign: 'center',
      color: '#64748b',
      fontWeight: '500',
      boxSizing: 'border-box'
    },
    pdfPreviewContainer: {
      marginTop: '1.5rem',
      padding: '1.5rem',
      background: '#f8fafc',
      borderRadius: '16px',
      border: '1px solid #e2e8f0'
    },
    pdfPreview: {
      width: '100%',
      height: '500px',
      borderRadius: '12px',
      border: '1px solid #cbd5e1'
    },
    note: {
      fontSize: '0.75rem',
      color: '#64748b',
      marginTop: '0.75rem',
      textAlign: 'center'
    }
  };

  if (currentPage === 'login') {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginBackground}></div>
        <h2 style={styles.loginTitle}>
          <span style={styles.loginTitleGradient}>Railway Concession</span>
        </h2>
        <div style={styles.loginCard}>
          <div style={styles.loginCardInner}>
            <h1 style={styles.loginHeading}>Sign In</h1>
            <div style={{ marginBottom: '2.5rem' }}>
              <label style={styles.loginLabel}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
                placeholder="your@email.com"
                style={styles.loginInput}
                onFocus={(e) => {
                  e.target.style.outline = '2px solid #2563eb';
                  e.target.style.outlineOffset = '2px';
                  e.target.style.borderColor = 'transparent';
                }}
                onBlur={(e) => {
                  e.target.style.outline = 'none';
                  e.target.style.borderColor = 'rgba(209, 213, 219, 0.3)';
                }}
              />
              {emailError && <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem' }}>{emailError}</p>}
            </div>
            <button onClick={handleLogin} style={styles.loginButton} onMouseOver={(e) => { e.target.style.background = '#1d4ed8'; e.target.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)'; }} onMouseOut={(e) => { e.target.style.background = '#2563eb'; e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'; }}>Continue</button>
          </div>
        </div>
      </div>
    );
  }

  if (currentPage === 'registration') {
    return (
      <div style={styles.regContainer}>
        <div style={styles.regInner}>
          <div style={styles.regHeader}>
            <h1 style={styles.regTitle}>Railway Concession</h1>
            <p style={styles.regSubtitle}>Student Registration Form</p>
          </div>
          <div style={styles.regCard}>
            <div style={{ marginBottom: '2.5rem' }}>
              <h2 style={styles.sectionTitle}>Personal Information</h2>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={styles.label}>Full Name</label>
                <input name="name" type="text" value={formData.name} onChange={handleFormChange} placeholder="Enter your full name" style={styles.input} onFocus={(e) => { e.target.style.outline = '2px solid #2563eb'; e.target.style.outlineOffset = '2px'; e.target.style.borderColor = '#2563eb'; e.target.style.background = 'white'; }} onBlur={(e) => { e.target.style.outline = 'none'; e.target.style.borderColor = '#cbd5e1'; e.target.style.background = '#f8fafc'; }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div><label style={styles.label}>Year</label><input name="year" type="text" value={formData.year} onChange={handleFormChange} placeholder="2024" style={styles.input} onFocus={(e) => { e.target.style.outline = '2px solid #2563eb'; e.target.style.outlineOffset = '2px'; e.target.style.borderColor = '#2563eb'; e.target.style.background = 'white'; }} onBlur={(e) => { e.target.style.outline = 'none'; e.target.style.borderColor = '#cbd5e1'; e.target.style.background = '#f8fafc'; }} /></div>
                <div><label style={styles.label}>Degree</label><select name="degree" value={formData.degree} onChange={handleFormChange} style={styles.input} onFocus={(e) => { e.target.style.outline = '2px solid #2563eb'; e.target.style.outlineOffset = '2px'; e.target.style.borderColor = '#2563eb'; e.target.style.background = 'white'; }} onBlur={(e) => { e.target.style.outline = 'none'; e.target.style.borderColor = '#cbd5e1'; e.target.style.background = '#f8fafc'; }}><option value="">Select degree</option><option value="btech">B.Tech</option><option value="mtech">M.Tech</option><option value="mba">MBA</option><option value="bcom">B.Com</option><option value="mcom">M.Com</option></select></div>
                <div><label style={styles.label}>Class</label><select name="class" value={formData.class} onChange={handleFormChange} style={styles.input} onFocus={(e) => { e.target.style.outline = '2px solid #2563eb'; e.target.style.outlineOffset = '2px'; e.target.style.borderColor = '#2563eb'; e.target.style.background = 'white'; }} onBlur={(e) => { e.target.style.outline = 'none'; e.target.style.borderColor = '#cbd5e1'; e.target.style.background = '#f8fafc'; }}><option value="">Select class</option><option value="first">First</option><option value="second">Second</option></select></div>
              </div>
              <div style={{ marginBottom: '1.5rem' }}><label style={styles.label}>Gender</label><select name="gender" value={formData.gender} onChange={handleFormChange} style={styles.input} onFocus={(e) => { e.target.style.outline = '2px solid #2563eb'; e.target.style.outlineOffset = '2px'; e.target.style.borderColor = '#2563eb'; e.target.style.background = 'white'; }} onBlur={(e) => { e.target.style.outline = 'none'; e.target.style.borderColor = '#cbd5e1'; e.target.style.background = '#f8fafc'; }}><option value="">Select Gender</option><option value="male">Male</option><option value="female">Female</option></select></div>
            </div>
            <div style={{ marginBottom: '2.5rem' }}>
              <h2 style={styles.sectionTitle}>Travel Information</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div><label style={styles.label}>Source Station</label><input name="source" type="text" value={formData.source} onChange={handleFormChange} placeholder="Starting point" style={styles.input} onFocus={(e) => { e.target.style.outline = '2px solid #2563eb'; e.target.style.outlineOffset = '2px'; e.target.style.borderColor = '#2563eb'; e.target.style.background = 'white'; }} onBlur={(e) => { e.target.style.outline = 'none'; e.target.style.borderColor = '#cbd5e1'; e.target.style.background = '#f8fafc'; }} /></div>
                <div><label style={styles.label}>Destination Station</label><input name="destination" type="text" value={formData.destination} onChange={handleFormChange} placeholder="End point" style={styles.input} onFocus={(e) => { e.target.style.outline = '2px solid #2563eb'; e.target.style.outlineOffset = '2px'; e.target.style.borderColor = '#2563eb'; e.target.style.background = 'white'; }} onBlur={(e) => { e.target.style.outline = 'none'; e.target.style.borderColor = '#cbd5e1'; e.target.style.background = '#f8fafc'; }} /></div>
              </div>
            </div>
            <div style={{ marginBottom: '2.5rem' }}>
              <h2 style={styles.sectionTitle}>Subscription Details</h2>
              <div style={{ marginBottom: '1.5rem' }}><label style={styles.label}>Subscription Plan</label><select name="plan" value={formData.plan} onChange={handleFormChange} style={styles.input} onFocus={(e) => { e.target.style.outline = '2px solid #2563eb'; e.target.style.outlineOffset = '2px'; e.target.style.borderColor = '#2563eb'; e.target.style.background = 'white'; }} onBlur={(e) => { e.target.style.outline = 'none'; e.target.style.borderColor = '#cbd5e1'; e.target.style.background = '#f8fafc'; }}><option value="">Select Subscription Plan</option><option value="quarterly">Quarterly (3 Months)</option><option value="half-yearly">Half Yearly (6 Months)</option><option value="yearly">Yearly (12 Months)</option></select></div>
              <div><label style={styles.label}>Total Amount</label><div style={styles.amountDisplay}><span style={styles.amountText}>₹ {formData.amount.toLocaleString()}</span></div></div>
            </div>
            <div style={{ paddingTop: '1.5rem' }}><div style={{ display: 'flex', gap: '1rem' }}><button onClick={handleRegistrationNext} style={styles.button} onMouseOver={(e) => { e.target.style.background = 'linear-gradient(to right, #1e40af, #1e3a8a)'; e.target.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)'; e.target.style.transform = 'scale(1.02)'; }} onMouseOut={(e) => { e.target.style.background = 'linear-gradient(to right, #2563eb, #1e40af)'; e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'; e.target.style.transform = 'scale(1)'; }}>Submit Application</button><button onClick={() => setCurrentPage('login')} style={styles.buttonSecondary} onMouseOver={(e) => { e.target.style.background = '#e2e8f0'; }} onMouseOut={(e) => { e.target.style.background = '#f1f5f9'; }}>Back</button></div></div>
          </div>
          <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#64748b', marginTop: '2rem' }}>Please ensure all information is accurate before submission</p>
        </div>
      </div>
    );
  }

  if (currentPage === 'idcard') {
    return (
      <div style={styles.idContainer}>
        <div style={styles.idInner}>
          <h1 style={styles.idTitle}>ID Card Verification</h1>
          <div style={styles.idCard}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '2rem' }}>
                <div><label style={styles.label}>Phone Number</label><input name="phone" type="tel" value={idData.phone} onChange={handleIdChange} placeholder="Enter 10-digit mobile number" maxLength="10" style={styles.input} onFocus={(e) => { e.target.style.outline = '2px solid #2563eb'; e.target.style.outlineOffset = '2px'; e.target.style.borderColor = '#2563eb'; e.target.style.background = 'white'; }} onBlur={(e) => { e.target.style.outline = 'none'; e.target.style.borderColor = '#cbd5e1'; e.target.style.background = '#f8fafc'; }} /></div>
                <div><label style={styles.label}>Aadhar Number</label><input name="aadhar" type="text" value={idData.aadhar} onChange={handleIdChange} placeholder="Enter 12-digit Aadhar number" maxLength="12" style={styles.input} onFocus={(e) => { e.target.style.outline = '2px solid #2563eb'; e.target.style.outlineOffset = '2px'; e.target.style.borderColor = '#2563eb'; e.target.style.background = 'white'; }} onBlur={(e) => { e.target.style.outline = 'none'; e.target.style.borderColor = '#cbd5e1'; e.target.style.background = '#f8fafc'; }} /></div>
                <p style={styles.note}>Your information is secure and will be used only for verification purposes</p>
              </div>
              <div><label style={styles.label}>Upload Document (PDF)</label><input type="file" accept=".pdf" onChange={handlePdfUpload} style={{ display: 'none' }} id="pdf-upload" /><label htmlFor="pdf-upload" style={styles.fileUploadLabel} onMouseOver={(e) => { e.currentTarget.style.borderColor = '#2563eb'; e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.color = '#2563eb'; }} onMouseOut={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#64748b'; }}>{idData.pdfFile ? `📄 ${idData.pdfFile.name}` : '📎 Click to upload PDF'}</label><p style={styles.note}>Please upload your ID card or relevant document in PDF format</p></div>
            </div>
            {pdfPreview && <div style={styles.pdfPreviewContainer}><span style={{ ...styles.label, display: 'block', marginBottom: '0.75rem' }}>Document Preview:</span><iframe src={pdfPreview} style={styles.pdfPreview} title="PDF Preview" /></div>}
            <div style={{ marginTop: '2.5rem' }}><div style={{ display: 'flex', gap: '1rem' }}><button onClick={submitToGoogleSheets} style={styles.button} disabled={isSubmitting} onMouseOver={(e) => { if (!isSubmitting) { e.target.style.background = 'linear-gradient(to right, #1e40af, #1e3a8a)'; e.target.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)'; e.target.style.transform = 'scale(1.02)'; } }} onMouseOut={(e) => { e.target.style.background = 'linear-gradient(to right, #2563eb, #1e40af)'; e.target.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'; e.target.style.transform = 'scale(1)'; }}>{isSubmitting ? 'Submitting...' : 'Verify & Continue'}</button><button onClick={() => setCurrentPage('registration')} style={styles.buttonSecondary} disabled={isSubmitting} onMouseOver={(e) => { if (!isSubmitting) { e.target.style.background = '#e2e8f0'; } }} onMouseOut={(e) => { e.target.style.background = '#f1f5f9'; }}>Back</button></div></div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default App;