# CodeChef-upsolve-scores

**Project Description: Automated Student Progress Tracker for CodeChef and AtCoder**

**Overview:**
This project aims to streamline and automate the tracking of students' progress in problem-solving on CodeChef and AtCoder platforms. It leverages Google Apps Script, JavaScript, and external APIs to fetch real-time data on students' contest participation, problem-solving during live hackathons, and subsequent upsolving activities. The system updates a Google Spreadsheet with detailed records, providing educators and administrators with valuable insights into students' coding proficiency and growth.

**Key Features:**

1. **Contest Data Retrieval:**
   - The script fetches a list of problems from a specified CodeChef or AtCoder contest, categorizing them into sections A, B, C, and D.

2. **Username Submissions Analysis:**
   - For each student, the system checks their submissions during a specific contest on the CodeChef platform.
   - It distinguishes between problems solved during the live contest and those yet to be upsolved.

3. **Upsolving Tracking:**
   - Utilizing the obtained list of problems to be upsolved, the system queries the CodeChef API to determine if a student has successfully upsolved any problems after the contest.
   - It considers the number and details of upsolved problems for each student.

4. **Spreadsheet Integration:**
   - The system dynamically updates a Google Spreadsheet, creating a new tab for each contest and populating it with relevant information.
   - The spreadsheet includes columns for Codechef username, contest performance, job readiness, campus engagement, and the number of problems upsolved.

5. **CSRF Token Authentication:**
   - The script employs CSRF token authentication to securely access restricted API endpoints on CodeChef.

**How to Use:**

1. **Set Up Spreadsheet:**
   - Create a Google Spreadsheet with a sheet named "contests" listing the contests chronologically in column A.

2. **Run the Script:**
   - Execute the main() function in the Google Apps Script editor.
   - The script automatically fetches contest data, updates student records, and populates the spreadsheet.

**Dependencies:**
   - Google Apps Script, JavaScript, Cheerio, Axios

**Notes:**
   - Ensure the proper functioning of Google Apps Script services and API access permissions.
   - This script is tailored for CodeChef and can be adapted for other platforms by modifying the API endpoints and data structures.

**Conclusion:**
By automating the tracking of students' coding progress, this project enhances the efficiency of educators in monitoring and guiding their students. The detailed insights into live contest performance and subsequent upsolving activities provide a comprehensive view of each student's coding journey, fostering a data-driven approach to education in the context of competitive programming.
