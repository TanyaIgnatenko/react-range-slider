function range(start, end) {
  return [...Array(end - start).keys()].map(key => key + start);
}

export { range };
