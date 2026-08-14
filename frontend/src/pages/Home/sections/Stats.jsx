const Stats = ({ stats }) => {
  const items = [
    { label: "Projects Completed", value: stats?.projectsCompleted ?? 0 },
    { label: "Happy Clients", value: stats?.happyClients ?? 0 },
    { label: "Years Experience", value: stats?.yearsExperience ?? 0 },
    { label: "Technologies", value: stats?.technologiesUsed ?? 0 },
  ];
  return (
    <section className="section stats-section">
      <div className="container grid grid-4">
        {items.map((item) => (
          <div key={item.label} className="glass-card stat-card">
            <h2 className="gradient-text">{item.value}+</h2>
            <p className="text-muted">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Stats;
