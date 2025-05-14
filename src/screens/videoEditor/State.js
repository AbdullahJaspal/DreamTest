class Node {
  constructor(data) {
    this.data = data;
    this.next = null;
    this.prev = null;
  }
}

class StateList {
  constructor(maxSize) {
    this.head = null;
    this.tail = null;
    this.current = null;
    this.maxSize = maxSize;
    this.size = 0;
    this.observers = [];
  }

  addState(newState) {
    if (this.current && this.current.data === newState) {
      return;
    }

    const newNode = new Node(newState);

    if (this.head === null) {
      this.head = newNode;
      this.tail = newNode;
      this.current = newNode;
    } else {
      while (this.current.next !== null) {
        this.removeLast();
      }

      this.current.next = newNode;
      newNode.prev = this.current;
      this.tail = newNode;
      this.current = newNode;
    }

    this.size++;

    if (this.size > this.maxSize) {
      this.removeFirst();
    }
  }

  removeFirst() {
    if (this.head !== null) {
      if (this.head === this.tail) {
        this.head = null;
        this.tail = null;
        this.current = null;
      } else {
        const secondNode = this.head.next;
        secondNode.prev = null;
        this.head.next = null;
        this.head = secondNode;

        if (this.current === this.head.prev) {
          this.current = secondNode;
        }
      }

      this.size--;
    }
  }

  removeLast() {
    if (this.tail !== null) {
      if (this.head === this.tail) {
        this.head = null;
        this.tail = null;
        this.current = null;
      } else {
        const secondLastNode = this.tail.prev;
        secondLastNode.next = null;
        this.tail.prev = null;
        this.tail = secondLastNode;

        if (this.current === this.tail.next) {
          this.current = secondLastNode;
        }
      }

      this.size--;
    }
  }

  undo() {
    if (this.current && this.current.prev !== null) {
      this.current = this.current.prev;
      return this.current.data;
    } else {
      return null;
    }
  }

  redo() {
    if (this.current && this.current.next !== null) {
      this.current = this.current.next;
      return this.current.data;
    } else {
      return null;
    }
  }
  addObserver(observer) {
    this.observers.push(observer);
  }

  removeObserver(observer) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  notifyObservers() {
    for (const observer of this.observers) {
      observer(this.current);
    }
  }
}
const stateList = new StateList(100);

export {stateList};
