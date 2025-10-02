# Test Scheduling Feature Implementation Guide

## ✅ Completed Steps:

### 1. Database Schema Updated
- Added `start_time DATETIME` column to tests table
- Added `end_time DATETIME` column to tests table
- Added `getTestsWithStatus()` function to calculate test status (scheduled/live/ended)

### 2. Backend Updated
- Modified `createTest()` function in `src/database.ts` to accept start_time and end_time
- Ready to handle scheduling data from frontend

---

## 🔧 Remaining Implementation Steps:

### Step 3: Update Create Test Form (Manual Edit Required)

**File:** `src/views/create-test.ejs`

**Location:** After line 255 (after the closing `</div>` of the duration/date grid, before "Test Description")

**Add this HTML code:**

```html
<!-- Test Scheduling Section -->
<div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
    <div class="flex items-center mb-3">
        <i class="fas fa-clock text-blue-600 mr-2"></i>
        <h3 class="text-lg font-semibold text-blue-900">Test Scheduling (Optional)</h3>
    </div>
    <p class="text-sm text-blue-700 mb-4">Set specific start and end times to control when students can take this test</p>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <label for="startTime" class="block text-sm font-medium text-blue-900 mb-2">
                <i class="fas fa-play-circle mr-1"></i>Start Time
            </label>
            <input type="datetime-local" id="startTime" name="startTime" class="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white">
            <p class="text-xs text-blue-600 mt-1">When students can start taking the test</p>
        </div>
        
        <div>
            <label for="endTime" class="block text-sm font-medium text-blue-900 mb-2">
                <i class="fas fa-stop-circle mr-1"></i>End Time
            </label>
            <input type="datetime-local" id="endTime" name="endTime" class="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white">
            <p class="text-xs text-blue-600 mt-1">When the test becomes unavailable</p>
        </div>
    </div>
    
    <div class="mt-3 p-3 bg-blue-100 rounded-lg">
        <p class="text-sm text-blue-800">
            <i class="fas fa-info-circle mr-1"></i>
            <strong>Note:</strong> If no times are set, the test will be immediately available to students after creation.
        </p>
    </div>
</div>
```

---

### Step 4: Update Form Submission JavaScript

**File:** `src/views/create-test.ejs`

**Location:** In the form submission handler (around line 552), update the `testData` object

**Find this code:**
```javascript
const testData = {
    title: document.getElementById('testTitle').value,
    description: document.getElementById('testDescription').value,
    subject: document.getElementById('testSubject').value,
    duration: document.getElementById('testDuration').value,
    scheduled_date: document.getElementById('testDate').value
};
```

**Replace with:**
```javascript
const testData = {
    title: document.getElementById('testTitle').value,
    description: document.getElementById('testDescription').value,
    subject: document.getElementById('testSubject').value,
    duration: document.getElementById('testDuration').value,
    scheduled_date: document.getElementById('testDate').value,
    start_time: document.getElementById('startTime').value || null,
    end_time: document.getElementById('endTime').value || null
};
```

---

### Step 5: Update Backend Controller

**File:** `src/controllers/teacherDashboardController.ts`

**Location:** In `createTestInitHandler` function (around line 259)

**Find this code:**
```typescript
const { title, description, subject, duration, scheduled_date } = req.body;
```

**Replace with:**
```typescript
const { title, description, subject, duration, scheduled_date, start_time, end_time } = req.body;
```

**Then find:**
```typescript
const testResult = await createTest({
    title,
    description: description || '',
    subject,
    duration: parseInt(duration),
    scheduled_date: scheduled_date || null,
    created_by: 1
});
```

**Replace with:**
```typescript
const testResult = await createTest({
    title,
    description: description || '',
    subject,
    duration: parseInt(duration),
    scheduled_date: scheduled_date || null,
    start_time: start_time || null,
    end_time: end_time || null,
    created_by: 1
});
```

---

### Step 6: Update Student Dashboard to Show Test Status

**File:** `src/controllers/studentCornerController.ts`

**Find the function that gets tests for students and replace the database call:**

**Replace:**
```typescript
const tests = await getAllTests();
```

**With:**
```typescript
import { getTestsWithStatus } from '../database';
const tests = await getTestsWithStatus();
```

---

### Step 7: Update Student Test List View

**File:** `src/views/student-corner.ejs` (or wherever tests are displayed to students)

**Add status badges and conditional button enabling:**

```html
<% tests.forEach(test => { %>
    <div class="test-card">
        <h3><%= test.title %></h3>
        <p><%= test.subject %> - <%= test.duration %> minutes</p>
        
        <!-- Status Badge -->
        <% if (test.status === 'scheduled') { %>
            <span class="badge bg-yellow-500 text-white">
                <i class="fas fa-clock"></i> Scheduled
            </span>
            <p class="text-sm text-gray-600">
                Starts: <%= new Date(test.start_time).toLocaleString() %>
            </p>
        <% } else if (test.status === 'live') { %>
            <span class="badge bg-green-500 text-white animate-pulse">
                <i class="fas fa-circle"></i> Live Now
            </span>
            <p class="text-sm text-gray-600">
                Ends: <%= new Date(test.end_time).toLocaleString() %>
            </p>
        <% } else if (test.status === 'ended') { %>
            <span class="badge bg-red-500 text-white">
                <i class="fas fa-ban"></i> Ended
            </span>
        <% } else { %>
            <span class="badge bg-blue-500 text-white">
                <i class="fas fa-check"></i> Available
            </span>
        <% } %>
        
        <!-- Start Test Button -->
        <button 
            class="btn-start-test <%= test.status === 'live' || test.status === 'available' ? '' : 'opacity-50 cursor-not-allowed' %>"
            <%= test.status === 'live' || test.status === 'available' ? '' : 'disabled' %>
            onclick="startTest(<%= test.id %>)"
        >
            <% if (test.status === 'scheduled') { %>
                <i class="fas fa-lock"></i> Not Yet Available
            <% } else if (test.status === 'ended') { %>
                <i class="fas fa-times-circle"></i> Test Ended
            <% } else { %>
                <i class="fas fa-play"></i> Start Test
            <% } %>
        </button>
    </div>
<% }); %>
```

---

### Step 8: Add Real-Time Status Updates (Optional)

**Add JavaScript to student dashboard to check status every minute:**

```javascript
<script>
// Check test status every minute
setInterval(function() {
    const now = new Date();
    
    document.querySelectorAll('.test-card').forEach(card => {
        const testId = card.dataset.testId;
        const startTime = new Date(card.dataset.startTime);
        const endTime = new Date(card.dataset.endTime);
        
        let status = 'available';
        if (startTime && endTime) {
            if (now < startTime) {
                status = 'scheduled';
            } else if (now >= startTime && now <= endTime) {
                status = 'live';
            } else if (now > endTime) {
                status = 'ended';
            }
        }
        
        // Update UI based on status
        updateTestCardStatus(card, status);
    });
}, 60000); // Check every minute

function updateTestCardStatus(card, status) {
    const badge = card.querySelector('.badge');
    const button = card.querySelector('.btn-start-test');
    
    if (status === 'live') {
        badge.className = 'badge bg-green-500 text-white animate-pulse';
        badge.innerHTML = '<i class="fas fa-circle"></i> Live Now';
        button.disabled = false;
        button.className = 'btn-start-test';
    } else if (status === 'scheduled') {
        badge.className = 'badge bg-yellow-500 text-white';
        badge.innerHTML = '<i class="fas fa-clock"></i> Scheduled';
        button.disabled = true;
        button.className = 'btn-start-test opacity-50 cursor-not-allowed';
    } else if (status === 'ended') {
        badge.className = 'badge bg-red-500 text-white';
        badge.innerHTML = '<i class="fas fa-ban"></i> Ended';
        button.disabled = true;
        button.className = 'btn-start-test opacity-50 cursor-not-allowed';
    }
}
</script>
```

---

## 🎨 CSS Styles to Add

```css
.badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 8px;
}

.btn-start-test {
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 600;
    transition: all 0.3s ease;
}

.btn-start-test:not(:disabled):hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.btn-start-test:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
}
```

---

## 📝 Summary of Changes Needed:

1. ✅ **Database** - Already updated with start_time and end_time columns
2. ✅ **Database Functions** - Already updated to handle scheduling
3. ⏳ **Create Test Form** - Add scheduling input fields (manual edit required)
4. ⏳ **Form Submission** - Include start_time and end_time in testData
5. ⏳ **Backend Controller** - Extract and pass scheduling data
6. ⏳ **Student Dashboard** - Use getTestsWithStatus() function
7. ⏳ **Student UI** - Show status badges and conditional buttons
8. ⏳ **Real-time Updates** - Add JavaScript to update status every minute

---

## 🚀 How It Works:

1. **Teacher creates test** with optional start and end times
2. **Database stores** the scheduling information
3. **Student dashboard** queries tests with calculated status
4. **Status is determined** by comparing current time with start/end times:
   - `scheduled` - Current time < start_time
   - `live` - Current time between start_time and end_time
   - `ended` - Current time > end_time
   - `available` - No scheduling set (always available)
5. **Start Test button** is only enabled when status is 'live' or 'available'
6. **Real-time updates** check status every minute and update UI

---

## 🧪 Testing:

1. Create a test with start time = 5 minutes from now, end time = 10 minutes from now
2. Check student dashboard - should show "Scheduled" badge, button disabled
3. Wait until start time - should change to "Live Now" badge, button enabled
4. Wait until end time - should change to "Ended" badge, button disabled again

---

## Would you like me to help you make these manual edits, or would you prefer to implement them yourself?
