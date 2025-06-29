import { useState } from 'react';

export default function Home() {
    const [file, setFile] = useState(null);
    const [event, setEvent] = useState("");
    const [response, setResponse] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);  // ✅ new loading state

    const handleSubmit = async () => {
        if (!file) return alert("Please select an image first!");

        setLoading(true);   // ✅ show analyzing
        setResponse(null);  // ✅ reset previous output

        const formData = new FormData();
        formData.append("image", file);
        formData.append("event_type", event);

        try {
            const res = await fetch("http://13.201.121.48:5001/analyze-outfit/", {
                method: "POST",
                body: formData
            });
            const data = await res.json();
            setResponse(data.feedback);
        } catch (err) {
            alert("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
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

                <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
                    <label
                        htmlFor="eventInput"
                        style={{
                            display: 'block',
                            marginBottom: '0.25rem',
                            fontSize: '0.95rem',
                            fontWeight: '600',
                            color: '#333'
                        }}
                    >
                        Define your event in less than 2 words
                    </label>
                    <input
                        id="eventInput"
                        type="text"
                        value={event}
                        onChange={(e) => setEvent(e.target.value)}
                        placeholder="e.g. Office, Date night"
                        style={{
                            padding: '0.5rem',
                            borderRadius: '0.5rem',
                            width: '100%',
                            border: '1px solid #ccc',
                            fontSize: '0.95rem'
                        }}
                    />
                </div>


                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    style={{
                        background: '#007bff',
                        color: '#fff',
                        border: 'none',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '0.5rem',
                        fontWeight: 'bold',
                        width: '100%',
                        cursor: 'pointer',
                        opacity: loading ? 0.6 : 1
                    }}
                >
                    {loading ? "Analyzing..." : "Submit"}
                </button>

                {/* Show loading message or response */}
                {loading && (
                    <p style={{ marginTop: '1.5rem', color: '#666' }}>
                        Analyzing your outfit...
                    </p>
                )}

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
