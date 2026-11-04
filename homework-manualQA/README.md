# 📌 Домашнє завдання по Manual QA #7 — Виконання

## 🎯 Аналіз вимог і тестування User Story (`US11_Guest Viewing Reservation Menu`)

**Вхідні артефакти:**
- User Story: [`user_story.pdf`](./user_story.pdf) (`[Draft] US11_Guest Viewing Reservation Menu`)
- Figma Design: [`design.png`](./design.png)
- Скріншот реалізованого застосунку: [`user_story_test_screenshot.png`](./user_story_test_screenshot.png)
- Тест-кейси та баг-репорти (Excel): [`user_story_cases.xlsx`](./user_story_cases.xlsx) (вкладки `Test cases` та `Defect reports`)
- Звіт про дефекти зі скріншотами (PDF): [`defect_report.pdf`](./defect_report.pdf)

---

## 1. Аналіз вимог (`user_story.pdf` та `design.png`) — Знайдені недоліки

Під час аналізу User Story **US11_Guest Viewing Reservation Menu** та її порівняння з Figma-макетом (`design.png`) виявлено такі дефекти вимог (неоднозначності, суперечності та пропуски):

1. **Суперечність і неоднозначність у Pre-conditions (Статуси бронювання та групової сесії):**
   - *Вимога:* `"The parent reservation or group session status is in Created/'Reserved'."`
   - *Недолік:* У доменній моделі системи батьківське бронювання (`Reservation`) має статус `"Reserved"` (не `"Created"`), тоді як групова сесія (`GroupReservation`) має статус `"Open"` (або `"Submitted"` / `"Closed"`). Використання неіснуючого статусу `"Created"` та сполучника `"or"` замість `"and"` робить умову некоректною (для перегляду меню мають одночасно виконуватись обидві умови: `Reservation = Reserved` **та** `GroupReservation = Open`).
2. **Неповнота та розбіжності в AC 1 (Категорії меню):**
   - *Вимога (AC 1):* `"The Guest can view the full restaurant menu structured logically by category (e.g., Appetizers, Main Course, Desserts)."`
   - *Недоліки:*
     - Використано нечітке формулювання `"e.g."` замість вичерпного переліку категорій.
     - Не вказано, яка вкладка категорії має бути обрана за замовчуванням при відкритті сторінки та чи повинна існувати вкладка `"All dishes"` (на макеті `design.png` вкладки `"All dishes"` немає, а за замовчуванням активна `"Appetizers"`).
     - Розбіжність у назвах: в AC 1 написано `"Main Course"` (однина), у Figma — друкарська помилка `"Main Cources"`, а на скріншоті реалізації — `"Main Courses"`.
     - Не описано поведінку системи, якщо в певній категорії немає жодної страви.
3. **Відсутність вимог до сортування страв у User Story (розбіжність із Figma):**
   - *Недолік:* На макеті `design.png` присутній елемент керування **`Sort by:`** зі списком опцій (`Popular First` за замовчуванням, `Newest First`, `Price: Low to High`, `Price: High to Low`) та приміткою `"Change: New Filter component"`. У документі `user_story.pdf` вимоги до сортування страв повністю відсутні.
4. **Суперечність у позначенні недоступних страв (AC 2 та AC 4 проти Figma):**
   - *Вимога (AC 4):* `"Items currently marked 'On Stop' are clearly indicated as unavailable and cannot be selected or added to the cart."`
   - *Недоліки:*
     - **Різна термінологія:** В AC 4 статус названо `"On Stop"`, на макеті `design.png` бейдж має текст **`"Sold Out"`**, а в реалізованому застосунку (`user_story_test_screenshot.png`) відображається **`"Out Of Stock"`**.
     - **Відображення кнопки дії для недоступних страв:** В AC 4 не уточнено, чи кнопка `"Pre-Order"` для недоступної страви має бути **прихована** (як на макеті `design.png` для картки *Green Asparagus Salad*), чи **заблокована (disabled)** (як реалізовано на скріншоті).
5. **Недостатня деталізація картки страви, взаємодії з кошиком та модального вікна страви (AC 2 та AC 3):**
   - *Вимоги (AC 2, AC 3):* `"Each menu item must clearly display name, price, serving size in grams, image and current availability status."` / `"The Guest can add an available dish directly to their personal subcart by interacting with a clear action button (e.g., 'Pre-order')"`
   - *Недоліки:*
     - Не визначено формат відображення ціни (`$17` без копійок у Figma проти `$14.99` / `$12.00` у реалізації) та ваги (`430 g` через пробіл проти `200g` разом).
     - Не описано, що має відображатися, якщо у страви відсутнє зображення (placeholder).
     - На макеті `design.png` кнопка `[Pre-Order]` показана лише на першій доступній картці (*Fresh Strawberry Mint Salad*) і відсутня на інших доступних картках (*Roasted Sweet Potato & Lentil Salad*, *Spring Salad*) — не вказано, чи кнопка відображається завжди, чи лише при наведенні курсора (hover).
     - Не описано візуальний відгук після натискання `[Pre-Order]` (toast-повідомлення, оновлення лічильника на іконці кошика в хедері).
     - **Пропущено модальне вікно деталей страви (Dish Modal):** На макеті `design.png` (нижній флоу) передбачено відкриття модального вікна з описом страви, калорійністю, БЖВ (`Protein`, `Fats`, `Carbs`), вітамінами та мінералами, але в `user_story.pdf` про нього немає жодної згадки.
6. **Відсутність у User Story вимог до шапки (Guest Header) та інформаційної плашки бронювання:**
   - *Недолік:* На макеті `design.png` явно зазначено зміну `"Guest variant Header"` (лише логотип `Green & Tasty` ліворуч та іконка `Cart` праворуч, без навігації клієнта) та зелений банер `"You are making a pre-order for the reservation 48 Rustaveli Avenue, Table 1, Oct 17, 2026, 12:00 - 13:30"`. У `user_story.pdf` ці елементи не описані.
7. **Неповнота AC 5 (Оновлення сторінки та обробка помилок):**
   - *Вимога (AC 5):* `"The menu reflects the current data at the time the Guest opens or refreshes the screen."`
   - *Недолік:* Не вказано, чи зберігається сесія гостя (`guestSessionId`, ім'я та вміст персонального підкошика) після оновлення сторінки (`F5`), що відбувається зі стравою в кошику, якщо під час оновлення вона перейшла у статус `"On Stop"`, а також як виглядають стани завантаження (loading), порожнього меню (empty state) або помилки сервера (error state).

---

## 2. Тест-кейси та результати тестування (`Test cases` у `user_story_cases.xlsx`)

Тестування проведено на основі вимог `user_story.pdf`, макета `design.png` та скріншота реалізованого застосунку `user_story_test_screenshot.png`.

| ID | Title | Pre-conditions | Steps | Expected Result | Status |
|---|---|---|---|---|---|
| **ID: 1** | Verify that Guest can view the Menu page layout, Guest Header, and Reservation info banner according to Figma design | 1. The Owner has generated and shared a valid invitation link<br>2. Parent reservation status is `"Reserved"` and group session status is `"Open"`<br>3. Guest has successfully joined the session (`US_G10`) | 1. Open the Guest Menu page.<br>2. Observe the top Header.<br>3. Observe the green reservation info strip below the Header.<br>4. Observe the breadcrumbs and Hero section. | 1. Guest Menu page is opened.<br>2. Top Header displays the Guest variant Header: only `"Green & Tasty"` logo on the left and `Cart` icon on the right (no `"Main page"`, `"Book a Table"`, `"Reservations"`, or `Profile` icon).<br>3. Green strip displays: `"You are making a pre-order for the reservation <Location>, Table <N>, <Date>, <Start time> - <End time>"`.<br>4. Breadcrumbs `"Main page > Menu"` and Hero banner `"Green & Tasty Restaurants"` / `"Menu"` are displayed according to Figma design. | **Failed** *(Defect #1, #2)* |
| **ID: 2** | Verify that the restaurant menu is structured by categories (`Appetizers`, `Main Courses`, `Desserts`) according to AC 1 and Figma design | 1. Guest has joined an active group session (`US_G10`)<br>2. Parent reservation status is `"Reserved"` | 1. Open the Guest Menu page.<br>2. Inspect the category navigation tabs above the dish list.<br>3. Click each category tab (`"Appetizers"`, `"Main Courses"`, `"Desserts"`). | 1. Category navigation tabs `"Appetizers"`, `"Main Courses"`, and `"Desserts"` are displayed.<br>2. `"Appetizers"` tab is active by default according to Figma design (no `"All dishes"` tab).<br>3. Clicking a category tab filters the dish list to show only dishes from the selected category. | **Failed** *(Defect #3)* |
| **ID: 3** | Verify that each available menu item displays name, price, serving size in grams, image, and active `[Pre-Order]` button (AC 2, AC 3) | 1. Guest has joined an active group session (`US_G10`)<br>2. Parent reservation status is `"Reserved"`<br>3. At least one available dish exists in the menu | 1. Open the Guest Menu page.<br>2. Inspect the available dish card (e.g., `"Margherita Pizza"`).<br>3. Check dish image, dish name, price, serving size in grams, and action button. | 1. Available dish card displays:<br>- Dish image corresponding to the specific dish<br>- Dish name (`"Margherita Pizza"`)<br>- Price in green (`"$14.99"`)<br>- Serving size in grams with consistent spacing (`"450 g"`)<br>- Active green `[Pre-Order]` button. | **Failed** *(Defect #6)* |
| **ID: 4** | Verify that items marked `"On Stop"` / `"Sold Out"` are clearly indicated as unavailable and cannot be added to the cart (AC 2, AC 4) | 1. Guest has joined an active group session (`US_G10`)<br>2. Parent reservation status is `"Reserved"`<br>3. Menu contains unavailable dishes marked `"On Stop"` (e.g., `"Fresh Avocado Toast"`, `"Truffle Mushroom Risotto"`) | 1. Open the Guest Menu page.<br>2. Inspect the unavailable dish cards (`"Fresh Avocado Toast"`, `"Truffle Mushroom Risotto"`).<br>3. Attempt to select or add an unavailable dish to the personal subcart. | 1. Unavailable dish cards are visually dimmed and display the unavailability badge (`"Sold Out"` per Figma / `"On Stop"` per AC 4) and greyed-out price.<br>2. According to Figma design, the `[Pre-Order]` button is not displayed on unavailable dish cards.<br>3. Guest cannot select or add the unavailable dish to the personal subcart. | **Failed** *(Defect #5)* |
| **ID: 5** | Verify that the `"Sort by:"` dropdown contains sorting options according to Figma design | 1. Guest has joined an active group session (`US_G10`)<br>2. Parent reservation status is `"Reserved"` | 1. Open the Guest Menu page.<br>2. Inspect the default value in the `"Sort by:"` dropdown.<br>3. Expand the `"Sort by:"` dropdown and verify available options. | 1. Default selected option is `"Popular First"`.<br>2. Dropdown contains options: `"Popular First"`, `"Newest First"`, `"Price: Low to High"`, `"Price: High to Low"`. | **Failed** *(Defect #4)* |
| **ID: 6** | Verify that Guest can add an available dish to their personal subcart by clicking `[Pre-Order]` (AC 3) | 1. Guest has joined an active group session (`US_G10`)<br>2. Parent reservation status is `"Reserved"`<br>3. Dish `"Margherita Pizza"` is available | 1. Open the Guest Menu page.<br>2. Click the green `[Pre-Order]` button on `"Margherita Pizza"`.<br>3. Open the Guest personal subcart. | 1. `"Margherita Pizza"` is added to the Guest personal subcart.<br>2. Subcart contains `"Margherita Pizza"` with quantity `1` and price `$14.99`. | **Passed** |
| **ID: 7** | Verify that the menu reflects current data when the Guest opens or refreshes the screen (AC 5) | 1. Guest has joined an active group session (`US_G10`)<br>2. Parent reservation status is `"Reserved"` | 1. Open the Guest Menu page.<br>2. Refresh the browser page (`F5` / Reload). | 1. Menu reloads and displays up-to-date dish prices, weights, and availability statuses while keeping the Guest session active. | **Passed** |

---

## 3. Дефект-репорти (`Defect reports` у `user_story_cases.xlsx` та `defect_report.pdf`)

Усі 6 знайдених дефектів оформлені за шаблоном у [`user_story_cases.xlsx`](./user_story_cases.xlsx) (вкладка `Defect reports`) та експортовані з виділеними червоною рамкою скріншотами у [`defect_report.pdf`](./defect_report.pdf):

1. **ID: 1 — Customer navigation header is shown instead of Guest header and Cart icon is misplaced in the reservation strip on Guest Menu page**
   - **Env:** `P_PRD` | **Priority:** `Medium` | **Severity:** `Minor`
   - **Pre-conditions:** The Owner has generated and shared a valid invitation link; Reservation status is `"Reserved"`; Guest has joined the session (`US_G10`).
   - **Steps:**
     1. Open the Guest Menu page via the shared invitation link.
     2. Pay attention to the top Header and the green reservation strip.
   - **Actual result:** The top Header displays Customer navigation links (`"Main page"`, `"Book a Table"`, `"Reservations"`) and the `User Profile` icon, while the `Cart` icon is placed inside the green reservation strip.
   - **Expected result:** According to Figma design (`Guest variant Header`), the top Header contains only the `"Green & Tasty"` logo on the left and the `Cart` icon on the right.

2. **ID: 2 — Reservation date is missing in the green reservation info strip on the Guest Menu page**
   - **Env:** `P_PRD` | **Priority:** `Medium` | **Severity:** `Minor`
   - **Pre-conditions:** The Owner has generated and shared a valid invitation link; Reservation status is `"Reserved"`; Guest has joined the session (`US_G10`).
   - **Steps:**
     1. Open the Guest Menu page.
     2. Inspect the text in the green reservation strip at the top of the page.
   - **Actual result:** `"You are making a pre-order for the reservation 48 Rustaveli Avenue, Table 1, 15:30 - 17:00"` is shown without the reservation date.
   - **Expected result:** Green strip includes the reservation date per Figma design: `"You are making a pre-order for the reservation 48 Rustaveli Avenue, Table 1, <Date>, 15:30 - 17:00"`.

3. **ID: 3 — "Desserts" category tab is missing and unexpected "All dishes" tab is displayed on the Guest Menu page**
   - **Env:** `P_PRD` | **Priority:** `High` | **Severity:** `Major`
   - **Pre-conditions:** The Owner has generated and shared a valid invitation link; Reservation status is `"Reserved"`; Guest has joined the session (`US_G10`).
   - **Steps:**
     1. Open the Guest Menu page.
     2. Observe the category filter tabs above the dish cards.
   - **Actual result:** Category bar shows `"All dishes"`, `"Appetizers"`, and `"Main Courses"`. The `"Desserts"` category tab is missing.
   - **Expected result:** According to AC 1 and Figma design, category tabs `"Appetizers"`, `"Main Courses"`, and `"Desserts"` are displayed (with `"Appetizers"` selected by default and no `"All dishes"` tab).

4. **ID: 4 — "Sort by:" dropdown displays "Recommended" instead of "Popular First" on the Guest Menu page**
   - **Env:** `P_PRD` | **Priority:** `Low` | **Severity:** `Minor`
   - **Pre-conditions:** The Owner has generated and shared a valid invitation link; Reservation status is `"Reserved"`; Guest has joined the session (`US_G10`).
   - **Steps:**
     1. Open the Guest Menu page.
     2. Pay attention to the `"Sort by:"` dropdown on the right side of the category bar.
   - **Actual result:** `"Sort by:"` dropdown displays `"Recommended"` by default.
   - **Expected result:** According to Figma design, `"Sort by:"` dropdown displays `"Popular First"` by default (with options `"Popular First"`, `"Newest First"`, `"Price: Low to High"`, `"Price: High to Low"`).

5. **ID: 5 — Unavailable dishes display "Out Of Stock" badge, green price, and disabled [Pre-Order] button instead of "Sold Out" / "On Stop" design**
   - **Env:** `P_PRD` | **Priority:** `Medium` | **Severity:** `Minor`
   - **Pre-conditions:** The Owner has generated and shared a valid invitation link; Reservation status is `"Reserved"`; Guest has joined the session (`US_G10`).
   - **Steps:**
     1. Open the Guest Menu page.
     2. Inspect the unavailable dish cards (`"Fresh Avocado Toast"` and `"Truffle Mushroom Risotto"`).
   - **Actual result:** Unavailable dish cards display an `"Out Of Stock"` badge, green price text (`$12.00`, `$22.50`), and a disabled grey `[Pre-Order]` button.
   - **Expected result:** According to Figma design and AC 4, unavailable items display `"Sold Out"` (or `"On Stop"` per AC 4), greyed-out price text, and no `[Pre-Order]` button.

6. **ID: 6 — All dish cards display identical placeholder salad image and inconsistent weight formatting ("200g" vs "450 g")**
   - **Env:** `P_PRD` | **Priority:** `Medium` | **Severity:** `Minor`
   - **Pre-conditions:** The Owner has generated and shared a valid invitation link; Reservation status is `"Reserved"`; Guest has joined the session (`US_G10`).
   - **Steps:**
     1. Open the Guest Menu page.
     2. Inspect the dish images and serving size labels on `"Fresh Avocado Toast"`, `"Truffle Mushroom Risotto"`, and `"Margherita Pizza"`.
   - **Actual result:** All 3 dishes show the exact same placeholder salad image, and weight formatting is inconsistent (`"200g"`, `"350g"` without a space vs `"450 g"` with a space).
   - **Expected result:** Each dish displays its own photo, and serving size in grams is formatted consistently with a space before `"g"` (`"200 g"`, `"350 g"`, `"450 g"`).
