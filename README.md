# Swiftcart E-commerce 🛒

A sophisticated, responsive e-commerce front-end built with a focus on modular JavaScript and clean, executive-style UI/UX. This project demonstrates dynamic product rendering and persistent state management.

---

## 🌟 Key Features

* **Dynamic Product Catalog:** Products are rendered dynamically from data objects using JavaScript, ensuring easy scalability.
* **Persistent Shopping Cart:** Integrated **LocalStorage** to keep cart data intact even after page refreshes.
* **Live Search Functionality:** Optimized search logic to filter through products in real-time.
* **Professional UI:** Built with a "luxury and precision" aesthetic, avoiding flashy distractions for a more mature user experience.
* **Fully Responsive:** Seamlessly transitions between desktop, tablet, and mobile views.

---

## 🛠️ Tech Stack

* **HTML5:** Semantic structure for SEO and accessibility.
* **CSS3:** Custom styling focusing on clean layouts and professional typography.
* **JavaScript (ES6+):** Functional programming approach for cart logic and DOM manipulation.

---

## 📂 Project Structure

```text
├── Assets/              # Project images and icons
├── styles/              # Global and component-specific CSS
├── index.html           # Homepage & Featured products
├── all-product.html     # Full catalog view
├── all-product.js       # Catalog filtering and search logic
└── script.js            # Main cart logic and navigation


# 📜 JavaScript Concepts Q&A

এই ফাইলটিতে জাভাস্ক্রিপ্টের ৫টি গুরুত্বপূর্ণ বিষয়ের সহজ ব্যাখ্যা দেওয়া হয়েছে।

---

## ১. `null` এবং `undefined` এর মধ্যে পার্থক্য কী?
-**undefined:** এটি একটি ডিফল্ট অবস্থা। যখন আপনি একটি ভেরিয়েবল ঘোষণা করেন কিন্তু তাতে কোনো মান (value) সেট করেন না, তখন জাভাস্ক্রিপ্ট নিজে থেকেই তাকে `undefined` ধরে নেয়। এর মানে হলো— "এই বক্সটি তৈরি করা হয়েছে, কিন্তু এর ভেতর এখনো কিছু রাখা হয়নি।"
-**null:** এটি একটি ইচ্ছাকৃত অবস্থা। যখন প্রোগ্রামার নিজে থেকে কোনো ভেরিয়েবলকে খালি বা "শূন্য" বোঝাতে চান, তখন তিনি `null` ব্যবহার করেন। এর মানে হলো— "আমি জানি এই বক্সটি আছে এবং আমি ইচ্ছা করেই এটি খালি রেখেছি।"

---

## ২. `map()` এর কাজ কী? এটি `forEach()` থেকে কীভাবে আলাদা?
- **map():** এটি একটি অ্যারের প্রতিটি উপাদানের ওপর কাজ করে এবং ফলাফল হিসেবে একটি **নতুন অ্যারে** তৈরি করে দেয়। এটি আসল অ্যারেকে পরিবর্তন করে না।
- **forEach():** এটি শুধু অ্যারের প্রতিটি উপাদানের ওপর দিয়ে একবার ঘুরে আসে (Loop চালায়), কিন্তু নিজে থেকে কোনো নতুন অ্যারে তৈরি বা রিটার্ন করে না।

**প্রধান পার্থক্য:** আপনার যদি নতুন একটি অ্যারে দরকার হয় তবে `map()` ব্যবহার করবেন, আর যদি শুধু ডেটা প্রিন্ট করা বা অন্য কোনো কাজ করতে হয় তবে `forEach()` ব্যবহার করবেন।

---

## ৩. `==` এবং `===` এর মধ্যে পার্থক্য কী?
- **`==` (Loose Equality):** এটি শুধুমাত্র দুই পাশের **মান (Value)** সমান কি না তা পরীক্ষা করে। যদি ডেটা টাইপ আলাদা হয় (যেমন: সংখ্যা ৫ এবং স্ট্রিং "৫"), এটি টাইপ পরিবর্তন করে মেলানোর চেষ্টা করে। তাই `5 == "5"` এর ফলাফল `true` আসবে।
- **`===` (Strict Equality):** এটি মান এবং **ডেটা টাইপ (Type)**—উভয়ই সমান কি না তা পরীক্ষা করে। তাই `5 === "5"` এর ফলাফল `false` আসবে।

---

## ৪. API থেকে ডেটা আনার ক্ষেত্রে `async/await` এর গুরুত্ব কী?
জাভাস্ক্রিপ্ট সাধারণত বড় কাজ (যেমন API থেকে ডেটা আনা) শেষ হওয়ার জন্য অপেক্ষা করে না। 
- **async/await** ব্যবহার করলে জাভাস্ক্রিপ্টকে বলা হয়, "ডেটা না আসা পর্যন্ত এই লাইনে অপেক্ষা করো, ডেটা আসলে তারপর পরের লাইনে যাও।" 
- এটি কোডকে দেখতে সহজ করে এবং ভুল হওয়ার সম্ভাবনা কমিয়ে দেয়।

---

## ৫. JavaScript-এ Scope এর ধারণা (Global, Function, Block)
Scope নির্ধারণ করে কোডের কোন অংশ থেকে কোন ভেরিয়েবলকে ব্যবহার করা যাবে।

* **Global Scope:** ভেরিয়েবলটি সব ফাংশনের বাইরে থাকে, কোডের যেকোনো জায়গা থেকে একে ব্যবহার করা যায়।
* **Function Scope:** ভেরিয়েবলটি শুধুমাত্র ওই ফাংশনের ভেতরেই কাজ করবে। বাইরে থেকে একে পাওয়া যাবে না।
* **Block Scope:** `{ }` ব্র্যাকেটের ভেতরে (যেমন `if` বা `for` লুপে) `let` বা `const` দিয়ে ভেরিয়েবল লিখলে তা শুধুমাত্র ওই ব্র্যাকেটের ভেতরেই সীমাবদ্ধ থাকে।
