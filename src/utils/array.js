function range(start, end, step = 1) {
  const range = [];
  for (let i = start; i < end; i += step) {
    range.push(i);
  }
  return range;
}

export { range };
