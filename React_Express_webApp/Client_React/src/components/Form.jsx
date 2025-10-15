import React, { useState } from 'react';

// Sandbox personas for testing API responses
const sandboxPersonas = [
  {
    name: "Jessica Review (Manual Review)",
    firstName: "Jessica",
    lastName: "Review",
    ssn: "123456789",
    dob: "1995-05-15",
    address: {
      line1: "100 Test St",
      line2: "",
      city: "Testville",
      state: "NY",
      zip: "10001",
      country: "US"
    },
    email: "jessica.review@example.com"
  },
  {
    name: "John Deny (Denied)",
    firstName: "John",
    lastName: "Deny",
    ssn: "987654321",
    dob: "1990-10-10",
    address: {
      line1: "200 Example Rd",
      line2: "",
      city: "Sampletown",
      state: "CA",
      zip: "90001",
      country: "US"
    },
    email: "john.deny@example.com"
  }
];
// Used to Initialize the registration form
const initialState = {
  firstName: '',
  lastName: '',
  address: {
    line1: '',
    line2: '',
    city: '',
    state: '',
    zip: '',
    country: 'US'
  },
  ssn: '',
  email: '',
  dob: ''
};
//
export default function Form() {
  const [form, setForm] = useState(initialState); //useState creates state variables:
  const [errors, setErrors] = useState({}); // errors stores validation errors.
  const [message, setMessage] = useState(null); // user-facing success or outcome messages.
  const [alloyResponse, setAlloyResponse] = useState(null); // helped with API testing in Frontend
  const [outcomeType, setOutcomeType] = useState(null); // 'manual' or 'deny' for colored banners

  // runs every time a user types into the field, updates form
  function handleChange(e) {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const key = name.split('.')[1];
      setForm(prev => ({ ...prev, address: { ...prev.address, [key]: value } }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  }

  // checks all fields for valid inputs
  function validateLocal() {
    const err = {};
    if (!form.firstName.trim()) err.firstName = 'Required';
    if (!form.lastName.trim()) err.lastName = 'Required';
    if (!form.address.line1.trim()) err['address.line1'] = 'Required';
    if (!form.address.city.trim()) err['address.city'] = 'Required';
    if (!/^[A-Za-z]{2}$/.test(form.address.state)) err['address.state'] = 'State must be 2 letters';
    if (!/^\d{5}(-\d{4})?$/.test(form.address.zip)) err['address.zip'] = 'Zip must be 5 digits';
    if (form.address.country !== 'US') err['address.country'] = 'Country must be US';
    if (!/^\d{9}$/.test(form.ssn)) err.ssn = 'SSN must be exactly 9 digits (no dashes)';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) err.email = 'Email invalid';
    if (!/^\d{4}-\d{2}-\d{2}$/.test(form.dob)) err.dob = 'DOB must be YYYY-MM-DD';
    return err;
  }
// stops the page from refreshing on submit. Resets messages
  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);
    setAlloyResponse(null);
    setOutcomeType(null);
// checks for errors, if found it will stop submission
    const clientErrors = validateLocal();
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }
    setErrors({});

    try {
        // sends api request and converts form to JSON
      const res = await fetch('http://localhost:5001/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      console.log('Alloy response:', data);
      setAlloyResponse(data);

      // Custom messages based on last name, changes OutcomeType too
      if (form.lastName.toLowerCase() === 'review') {
        setMessage("Thanks for submitting your application, we'll be in touch shortly!");
        setOutcomeType('manual');
      } else if (form.lastName.toLowerCase() === 'deny') {
        setMessage("Sorry, your application was not successful.");
        setOutcomeType('deny');
      } else {
        setMessage('Fantastic, you have created an account with Best Bank!');
        setOutcomeType('success');
      }

      setForm(initialState); // resets form after successful submission
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ server: 'Failed to submit form' });
    }
  }

  // Styles, organizes the objects for an easier time to read
  const containerStyle = { maxWidth: 600, margin: '40px auto', fontFamily: 'Arial, sans-serif', padding: 20, border: '1px solid #ddd', borderRadius: 10, backgroundColor: '#f9f9f9' };
  const inputStyle = { width: '100%', padding: 10, marginTop: 4, marginBottom: 10, borderRadius: 5, border: '1px solid #ccc', boxSizing: 'border-box' };
  const labelStyle = { fontWeight: 'bold', display: 'block', marginTop: 10 };
  const buttonStyle = { marginTop: 20, padding: '10px 20px', border: 'none', borderRadius: 5, backgroundColor: '#4CAF50', color: 'white', fontWeight: 'bold', cursor: 'pointer' };
  const responseBoxStyle = { marginTop: 20, padding: 15, backgroundColor: '#eaeaea', borderRadius: 5, whiteSpace: 'pre-wrap', wordBreak: 'break-word' };
  const messageStyle = {
    // color for the different outcomes
    manual: { backgroundColor: '#fff3cd', padding: 15, borderRadius: 5, color: '#856404', marginTop: 20 },
    deny: { backgroundColor: '#f8d7da', padding: 15, borderRadius: 5, color: '#721c24', marginTop: 20 },
    success: { backgroundColor: '#d4edda', padding: 15, borderRadius: 5, color: '#155724', marginTop: 20 }
  };

  return (
    <form onSubmit={handleSubmit} style={containerStyle}>
      <h2 style={{ textAlign: 'center' }}>Registration Form</h2>
        
      {/* Sandbox persona selector, updates the form on the persona picked. It updates form using setForm*/} 
      <label style={labelStyle}>Use Sandbox Persona:</label>
      <select
        style={inputStyle}
        defaultValue=""
        onChange={(e) => {
          const index = e.target.value;
          if (index === "") return;
          setForm(sandboxPersonas[index]);
        }}
      >
        <option value="">-- Select a Persona --</option>
        {sandboxPersonas.map((p, i) => (
          <option key={i} value={i}>{p.name}</option>
        ))}
      </select>

      <label style={labelStyle}>First Name:</label>
      <input name="firstName" value={form.firstName} onChange={handleChange} style={inputStyle} />
      {errors.firstName && <div style={{ color: 'red' }}>{errors.firstName}</div>}

      <label style={labelStyle}>Last Name:</label>
      <input name="lastName" value={form.lastName} onChange={handleChange} style={inputStyle} />
      {errors.lastName && <div style={{ color: 'red' }}>{errors.lastName}</div>}

      <label style={labelStyle}>Address Line 1:</label>
      <input name="address.line1" value={form.address.line1} onChange={handleChange} style={inputStyle} />
      {errors['address.line1'] && <div style={{ color: 'red' }}>{errors['address.line1']}</div>}

      <label style={labelStyle}>Address Line 2:</label>
      <input name="address.line2" value={form.address.line2} onChange={handleChange} style={inputStyle} />

      <label style={labelStyle}>City:</label>
      <input name="address.city" value={form.address.city} onChange={handleChange} style={inputStyle} />
      {errors['address.city'] && <div style={{ color: 'red' }}>{errors['address.city']}</div>}

      <label style={labelStyle}>State:</label>
      <input name="address.state" value={form.address.state} onChange={handleChange} style={inputStyle} />
      {errors['address.state'] && <div style={{ color: 'red' }}>{errors['address.state']}</div>}

      <label style={labelStyle}>Zip:</label>
      <input name="address.zip" value={form.address.zip} onChange={handleChange} style={inputStyle} />
      {errors['address.zip'] && <div style={{ color: 'red' }}>{errors['address.zip']}</div>}

      <label style={labelStyle}>Country:</label>
      <input name="address.country" value="US" readOnly style={{ ...inputStyle, backgroundColor: '#eee' }} />

      <label style={labelStyle}>SSN:</label>
      <input name="ssn" value={form.ssn} onChange={handleChange} style={inputStyle} />
      {errors.ssn && <div style={{ color: 'red' }}>{errors.ssn}</div>}

      <label style={labelStyle}>Email:</label>
      <input name="email" value={form.email} onChange={handleChange} style={inputStyle} />
      {errors.email && <div style={{ color: 'red' }}>{errors.email}</div>}

      <label style={labelStyle}>Date of Birth:</label>
      <input name="dob" type="date" value={form.dob} onChange={handleChange} style={inputStyle} />
      {errors.dob && <div style={{ color: 'red' }}>{errors.dob}</div>}

      <button type="submit" style={buttonStyle}>Submit</button>

      {message && <div style={messageStyle[outcomeType]}>{message}</div>}
      {errors.server && <div style={{ marginTop: 20, color: 'red', fontWeight: 'bold' }}>{errors.server}</div>}

      {/*alloyResponse && (
        <div style={responseBoxStyle}>
          <h4>Alloy Response:</h4>
          <pre>{JSON.stringify(alloyResponse, null, 2)}</pre>
        </div>
      )} */}
    </form>
  );
}
