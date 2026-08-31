Issue details
News and Magazines policy: Violation of News and Magazines policy
Your app contains content that doesn’t comply with the News and Magazines policy. Apps that declare themselves or are listed as "News and Magazine" in the Google Play Console must meet the News policy requirements. Specifically, it appears that your app:

Doesn't contain a dedicated website and in-app page that’s easy to find and clearly shows relevant contact information. Make sure to:
Add a link to the News website in your Google Play Console account in the “Store listing contact details” section.
Include a clearly labeled section for contact information in your app and website (such as “Contact us” or similar).
Add a phone number or email address. Make sure it is related to your app or the developer.
If you are a News Aggregator, a valid contact information is also required for users to contact the developer of the app.
Update your contact information URL in your declaration form.

Where this issue was found
This issue may also be found in other locations. Check all areas of your app when fixing this issue.

Location
Evidence
In-app experience
https://lh3.googleusercontent.com/BBg8-BEOIZNPAu8jtxS0LZWjLjbWK6_8fBAy_ZRKrtahWs9MSUpktmPNfMSCsPrjUWA

How to fix
Make necessary updates to your app, such as:
Create a valid website and in-app contact page that includes either an email address or a phone number
Social media accounts don't count as contact information
Ensure that the app contains content that’s less than three months old
Provide original sources (author or publisher) for all articles
Confirm that your News and Magazines declaration is accurate and up to date.
Confirm that your app category is setup correctly to reflect your app content and its purpose (i.e., News and Magazine).
Update your News and Magazine apps declaration if required.
For more information on accurately declaring the news / magazine app , please visit our Help Center article.

----------------

If you need to check and fix any at server side project is at:
/var/www/html/dhangadhikhabar

-------------

Google ply console:
https://play.google.com/console/u/4/developers/7639671398854955188/app/4975763639936096588/app-dashboard

----------------

Fix applied 2026-08-31:
- App: added a "सम्पर्क" (Contact) screen reachable from the drawer menu (src/screens/ContactScreen.tsx), showing office address, phone (tel: links), and email (mailto: link) — dhnkhabar@gmail.com, 977-91417611 / 977-9851168362.
- Website: the dedicated Contact Us page (/var/www/html/dhangadhikhabar, src/AppBundle/Resources/views/Home/contact.html.twig) previously only showed a message form with no visible phone/email; added the same address/phone/email block above the form. Also fixed a `href="email:..."` typo (should be `mailto:`) in the site footer.
- Still to do in Play Console (not code): update "Store listing contact details" and the News and Magazine declaration's contact information URL to point at https://www.dhangadhikhabar.com/contact, then resubmit.

----------------

Live Site:
https://www.dhangadhikhabar.com/

Contact Page:
https://www.dhangadhikhabar.com/contact