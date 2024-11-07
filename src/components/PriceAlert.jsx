const PriceAlert = ({ onSetAlert }) => {
  return (
    <div className="price-alert-container">
      <h3>🔔 Price Alerts</h3>
      <div className="alert-form">
        <input type="number" placeholder="Target price" />
        <input type="email" placeholder="Your email" />
        <button onClick={onSetAlert}>Notify me</button>
      </div>
    </div>
  );
}; 