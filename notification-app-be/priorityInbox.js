import fs from 'fs';
import { Log } from 'logging-middleware';

function getWeight(type) {
  if (type === 'Placement') return 3;
  if (type === 'Result') return 2;
  if (type === 'Event') return 1;
  return 0;
}

function comparePriority(a, b) {
  const wA = getWeight(a.Type);
  const wB = getWeight(b.Type);
  if (wA !== wB) {
    return wA - wB;
  }
  const dateA = new Date(a.Timestamp).getTime();
  const dateB = new Date(b.Timestamp).getTime();
  return dateA - dateB;
}

class MinHeap {
  constructor(maxSize) {
    this.heap = [];
    this.maxSize = maxSize;
  }

  push(val) {
    if (this.heap.length < this.maxSize) {
      this.heap.push(val);
      this.bubbleUp(this.heap.length - 1);
    } else if (comparePriority(val, this.heap[0]) > 0) {
      this.heap[0] = val;
      this.bubbleDown(0);
    }
  }

  bubbleUp(index) {
    while (index > 0) {
      let parent = Math.floor((index - 1) / 2);
      if (comparePriority(this.heap[index], this.heap[parent]) < 0) {
        this.swap(index, parent);
        index = parent;
      } else {
        break;
      }
    }
  }

  bubbleDown(index) {
    while (true) {
      let left = 2 * index + 1;
      let right = 2 * index + 2;
      let smallest = index;

      if (left < this.heap.length && comparePriority(this.heap[left], this.heap[smallest]) < 0) {
        smallest = left;
      }
      if (right < this.heap.length && comparePriority(this.heap[right], this.heap[smallest]) < 0) {
        smallest = right;
      }

      if (smallest !== index) {
        this.swap(index, smallest);
        index = smallest;
      } else {
        break;
      }
    }
  }

  swap(i, j) {
    let temp = this.heap[i];
    this.heap[i] = this.heap[j];
    this.heap[j] = temp;
  }

  getSorted() {
    return [...this.heap].sort((a, b) => comparePriority(b, a));
  }
}

async function main() {
  await Log("backend", "info", "service", "Starting Priority Inbox processing");

  const token = process.env.AUTH_TOKEN;
  if (!token) {
    await Log("backend", "fatal", "service", "No AUTH_TOKEN provided");
    return;
  }

  try {
    await Log("backend", "info", "api", "Fetching notifications");

    const response = await fetch("http://4.224.186.213/evaluation-service/notifications", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const data = await response.json();
    const notifications = data.notifications || [];

    await Log("backend", "info", "service", `Received ${notifications.length} notifications`);

    const heap = new MinHeap(10);
    for (const notif of notifications) {
      heap.push(notif);
    }

    const top10 = heap.getSorted();

    fs.writeFileSync('output.json', JSON.stringify(top10, null, 2));

    await Log("backend", "info", "service", "Successfully processed top 10 notifications and wrote to output.json");
  } catch (error) {
    await Log("backend", "error", "api", `Error in processing notifications: ${error.message}`);
  }
}

main();
