setInterval(async () => {
  const res = await fetch("https://github.com/nickerions/notioneo-auto-month-script/blob/main/src/main.ts");
  const script = await res.text();
  eval(script);
}, 5000);
