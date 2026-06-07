export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer style={{
      borderTop: "1px solid var(--border)",
      padding: "20px 32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 20,
      fontSize: 12,
      color: "var(--muted)",
      flexWrap: "wrap",
      marginTop: 48,
    }}>
      <span>© {year} MetriQuill · Free Ad Report Generator</span>
      <span style={{ color: "var(--border)" }}>·</span>
      <a
        href="https://metriquill.com?utm_source=free-tool&utm_medium=footer&utm_campaign=upgrade"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "var(--muted)", textDecoration: "none", opacity: 0.8 }}
      >
        metriquill.com
      </a>
      <span style={{ color: "var(--border)" }}>·</span>
      <a
        href="https://metriquill.com/signup?utm_source=free-tool&utm_medium=footer&utm_campaign=upgrade"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "var(--orange, #FF6B2B)", textDecoration: "none", fontWeight: 600 }}
      >
        Try the full app →
      </a>
    </footer>
  );
}
