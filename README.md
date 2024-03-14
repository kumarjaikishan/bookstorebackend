# Book Store System


# Live
Running At- bookstorefronted.vercel.app

### Sellcount Logic
We have used Mongoose Session and Transaction to ensure Implement proper synchronization to handle race conditions on any book purchase


### Sellcount Logic
A sellcount field is provided in Book schema itself and as any book sell, it update its sellcount field with incremental value of 1 at the points of book sell.

### Sending email notifications.
 For sending Email Notification, we Have used 'BullMQ' library to handle the message queue asynchronously and also implemented condtions like max 100 email per hour and a delay of 2s before sending another mail.

### Some Test Key
id- admin@gmail.com , password = admin@123

Note- any user id must a valid email for email verification or it can be manage in Admin panel, Admin can set Usertype and user verification.



## Key Features


### User Authentication and Authorization
- **Sign Up:** Users can create new accounts.
- **Login:** Registered users can log in to access their accounts.
- **Logout:** Users can log out securely.
- **Authentication:** Secure authentication mechanism to protect user accounts.
- **Authorization:** Role-based access control for different user types (e.g., admin, retail user).


### Book Management
- **Create Book:** Admin users can add new books to the inventory.
- **Update Book:** Admin users can edit book details such as title, author, price, etc.
- **Delete Book:** Admin users can remove books from the inventory.

### Sales Tracking
- **Purchase History:** Users can view their purchase history.
- **Order Management:** Author users can manage orders and track sales.



1. Clone the repository:

   ```bash
   git clone https://github.com/kumarjaikishan/frontend.git
