setInterval(async () => {
  const res = await fetch("./src/main.ts");
  const script = await res.text();
  eval(script);
}, 5000);
