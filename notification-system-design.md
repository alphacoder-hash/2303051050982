# Notification System Design

## Stage 1

### Approach: Priority Inbox using Min-Heap
To address the problem of users losing track of important notifications due to high volume, we implemented a Priority Inbox that automatically maintains the top 10 most important unread notifications.

**Priority Criteria:**
The importance of a notification is determined primarily by its `Type` in the following order:
1. **Placement** (Highest weight: 3)
2. **Result** (Medium weight: 2)
3. **Event** (Lowest weight: 1)

If two notifications have the exact same `Type` (and therefore the same weight), the tie is broken using **recency** (the `Timestamp` field), with newer notifications taking precedence over older ones.

**Efficient Maintenance (Min-Heap Strategy):**
Because new notifications arrive continuously, sorting the entire array of notifications every single time a new one arrives would be highly inefficient (O(N log N)).

Instead, we used a **Min-Heap** data structure configured with a maximum capacity of 10. 
- A Min-Heap allows us to keep track of the "least important" notification currently in our top 10 (this element sits at the root of the heap).
- As new notifications stream in, we simply compare the incoming notification to the root.
- If the new notification is *less* important than the root, we ignore it.
- If it is *more* important, we remove the root and insert the new notification, letting the heap automatically rebalance itself.

This Min-Heap approach ensures that processing a new incoming notification takes only **O(log k)** time (where k is the size of the inbox, which is a constant 10). Thus, it is extremely efficient and scales perfectly regardless of how high the notification volume gets.

**Compliance Constraints:**
All tracking, debugging, and error handling are performed securely via the provided `logging-middleware`. Explicit console logging was entirely avoided in the final output generation to strictly adhere to the evaluation constraints; instead, the top 10 result is output securely to a local file for reporting purposes.
