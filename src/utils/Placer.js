import { getPageOffsets } from './position';

const defaultConfig = {
  relatedToContainer: document.body,
  minLeft: -Infinity,
  maxLeft: Infinity,
  minTop: -Infinity,
  maxTop: Infinity,
};

class Placer {
  constructor({
    relatedToContainer = document.body,
    minLeft = -Infinity,
    maxLeft = Infinity,
    minTop = -Infinity,
    maxTop = Infinity,
  } = defaultConfig) {
    const offsets = getPageOffsets(relatedToContainer);
    this.system = {
      offsetLeft: offsets.left,
      offsetTop: offsets.top,
    };

    this.minLeft = minLeft;
    this.maxLeft = maxLeft;
    this.minTop = minTop;
    this.maxTop = maxTop;
  }

  place(pagePosition) {
    const containerPosition = this.toContainerPosition(pagePosition);
    return this.limitPosition(containerPosition);
  }

  toContainerPosition(pagePosition) {
    return {
      left: pagePosition.left - this.system.offsetLeft,
      top: pagePosition.top - this.system.offsetTop,
    };
  }

  limitPosition(position) {
    return {
      left: this.limitLeft(position.left),
      top: this.limitTop(position.top),
    };
  }

  limitLeft = left => Math.min(Math.max(this.minLeft, left), this.maxLeft);

  limitTop = top => Math.min(Math.max(this.minTop, top), this.maxTop);

  setMinLeft = minLeft => (this.minLeft = minLeft);

  setMaxLeft = maxLeft => {
    return (this.maxLeft = maxLeft);
  };

  setMinTop = minTop => (this.minTop = minTop);

  setMaxTop = maxTop => (this.maxTop = maxTop);
}

export { Placer };
