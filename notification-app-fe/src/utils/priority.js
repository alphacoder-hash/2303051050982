export function getWeight(type) {
    if (type === 'Placement') return 3;
    if (type === 'Result') return 2;
    if (type === 'Event') return 1;
    return 0;
}

export function compareNotifications(a, b) {
    const weightA = getWeight(a.Type);
    const weightB = getWeight(b.Type);
    if (weightA !== weightB) {
        return weightA - weightB; // Ascending order of weight
    }
    const timeA = new Date(a.Timestamp).getTime();
    const timeB = new Date(b.Timestamp).getTime();
    return timeA - timeB; // Ascending order of time
}

export class MinHeap {
    constructor(maxSize) {
        this.heap = [];
        this.maxSize = maxSize;
    }

    push(val) {
        if (this.heap.length < this.maxSize) {
            this.heap.push(val);
            this._bubbleUp(this.heap.length - 1);
        } else if (compareNotifications(val, this.heap[0]) > 0) {
            this.heap[0] = val;
            this._bubbleDown(0);
        }
    }

    getSorted() {
        return [...this.heap].sort((a, b) => compareNotifications(b, a)); // Descending for display
    }

    _bubbleUp(index) {
        while (index > 0) {
            let parentIndex = Math.floor((index - 1) / 2);
            if (compareNotifications(this.heap[parentIndex], this.heap[index]) <= 0) break;
            [this.heap[parentIndex], this.heap[index]] = [this.heap[index], this.heap[parentIndex]];
            index = parentIndex;
        }
    }

    _bubbleDown(index) {
        const length = this.heap.length;
        while (true) {
            let leftChildIndex = 2 * index + 1;
            let rightChildIndex = 2 * index + 2;
            let smallestIndex = index;

            if (leftChildIndex < length && compareNotifications(this.heap[leftChildIndex], this.heap[smallestIndex]) < 0) {
                smallestIndex = leftChildIndex;
            }
            if (rightChildIndex < length && compareNotifications(this.heap[rightChildIndex], this.heap[smallestIndex]) < 0) {
                smallestIndex = rightChildIndex;
            }
            if (smallestIndex === index) break;
            
            [this.heap[smallestIndex], this.heap[index]] = [this.heap[index], this.heap[smallestIndex]];
            index = smallestIndex;
        }
    }
}
