import { useRef, useState } from "react";
import { FiUploadCloud, FiX, FiFile } from "react-icons/fi";
import { uploadFile } from "../../services/uploadApi";
import { getFileUrl } from "../../utils/helpers";
import "./ImageUpload.css";

/**
 * Drop-in replacement for a plain "Image URL" text field.
 * Lets the admin either upload a file (stored on the backend, under /uploads)
 * or paste an external URL directly — value is always the resulting URL string.
 *
 * Props: value (string url), onChange(url), accept ("image" | "pdf"), label
 */
const ImageUpload = ({ value, onChange, accept = "image", label = "Image" }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const acceptAttr = accept === "pdf" ? ".pdf" : "image/jpeg,image/jpg,image/png,image/gif,image/webp";

  const handleFile = async (file) => {
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const { data } = await uploadFile(file);
      onChange(data.url);
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const isImage = accept === "image";

  return (
    <div className="image-upload">
      {value && isImage && (
        <div className="image-upload-preview">
          <img src={getFileUrl(value)} alt="Preview" />
          <button type="button" className="image-upload-remove" onClick={() => onChange("")} aria-label="Remove">
            <FiX />
          </button>
        </div>
      )}

      {value && !isImage && (
        <div className="image-upload-file-chip">
          <FiFile />
          <a href={getFileUrl(value)} target="_blank" rel="noreferrer">View current file</a>
          <button type="button" className="image-upload-remove" onClick={() => onChange("")} aria-label="Remove">
            <FiX />
          </button>
        </div>
      )}

      <div className="image-upload-actions">
        <input
          ref={inputRef}
          type="file"
          accept={acceptAttr}
          style={{ display: "none" }}
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        <button
          type="button"
          className="btn btn-outline btn-sm"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          <FiUploadCloud /> {uploading ? "Uploading..." : value ? `Replace ${label}` : `Upload ${label}`}
        </button>
        <input
          className="form-control"
          style={{ marginTop: 8 }}
          placeholder="...or paste an image/file URL"
          value={value?.startsWith("/uploads") ? "" : value || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>

      {error && <p className="form-error">{error}</p>}
    </div>
  );
};

export default ImageUpload;
