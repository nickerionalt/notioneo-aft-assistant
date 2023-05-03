setInterval(async () => {
  const res = await fetch("https://raw.githubusercontent.com/nickerions/notioneo-auto-month-script/main/src/main.ts");
  const script = await res.text();
  try {
    eval(script);
  } catch (error) {
    console.error(error);
  }
}, 5000);
