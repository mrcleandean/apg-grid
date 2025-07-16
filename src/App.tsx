import ProductGrid from "@/ProductGrid/ProductGrid";
import "./App.css";

function App() {
  try {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#f0f2f5",
          padding: "20px",
        }}
      >
        <h1 style={{ color: "#213547", marginBottom: "20px" }}>
          Accessible Data Grid
        </h1>

        <button
          style={{
            padding: "10px 20px",
            marginBottom: "20px",
            background: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Focusable Element Before Grid
        </button>

        <ProductGrid />

        <button
          style={{
            padding: "10px 20px",
            marginTop: "20px",
            background: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Focusable Element After Grid
        </button>
      </div>
    );
  } catch (error) {
    console.error("Error in App component:", error);
    return (
      <div style={{ padding: "20px", color: "red" }}>
        <h1>Error loading application</h1>
        <p>Please check the console for details.</p>
      </div>
    );
  }
}

export default App;
