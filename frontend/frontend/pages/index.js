import { useState } from 'react';

export default function Home() {
    const [file, setFile] = useState(null);
    const [event, setEvent] = useState("Office");
    const [response, setResponse] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleSubmit = async () => {
        if (!file) return alert("Please select an image first!");

        const formData = new FormData();
        formData.append("image", file);
        formData.append("event_type", event);

        const res = await fetch("http://127.0.0.1:5000/analyze-outfit/", {
            method: "POST",
            body: formData
        });

        const data = await res.json();
        setResponse(data.feedback);
    };

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        setFile(selected);
        if (selected) {
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(selected);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#f8f9fa',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <div style={{
                background: '#fff',
                padding: '2rem',
                borderRadius: '1rem',
                width: '100%',
                maxWidth: '400px',
                boxShadow: '0 0 20px rgba(0,0,0,0.05)',
                textAlign: 'center'
            }}>
                <h2 style={{ marginBottom: '1rem' }}>Choose an image</h2>

                <input
                    type="file"
                    onChange={handleFileChange}
                    style={{ marginBottom: '1rem', width: '100%' }}
                />

                <div style={{
                    border: '2px dashed #ccc',
                    borderRadius: '0.75rem',
                    padding: '1.5rem',
                    marginBottom: '1rem',
                    background: '#fefefe'
                }}>
                    {preview ? (
                        <img
                            src={preview}
                            alt="preview"
                            style={{ maxHeight: '150px', objectFit: 'contain' }}
                        />
                    ) : (
                        <p style={{ color: '#999' }}>Choose an image</p>
                    )}
                </div>

                <select
                    value={event}
                    onChange={(e) => setEvent(e.target.value)}
                    style={{
                        marginBottom: '1rem',
                        padding: '0.5rem',
                        borderRadius: '0.5rem',
                        width: '100%',
                        border: '1px solid #ccc'
                    }}
                >
                    <option>Office</option>
                    <option>Date night</option>
                    <option>Airport</option>
                    <option>Corporate event</option>
                </select>

                <button
                    onClick={handleSubmit}
                    style={{
                        background: '#007bff',
                        color: '#fff',
                        border: 'none',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '0.5rem',
                        fontWeight: 'bold',
                        width: '100%',
                        cursor: 'pointer'
                    }}
                >
                    Submit
                </button>

                {response && (
                    <div style={{ marginTop: '1.5rem', textAlign: 'left' }}>
                        <p><strong>Suitability:</strong> {response.suitability}</p>
                        <p><strong>Color Rating:</strong> {response.color_rating}</p>
                        <p><strong>Suggestions:</strong> {response.suggestions}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
