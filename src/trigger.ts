setInterval(async () => {
  const res = await fetch("./main.ts");
  const script = await res.text();
  try {
    eval(script);
  } catch (error) {
    console.error(error);
  }
}, 5000);
