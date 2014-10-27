Extract selectors from files into a stylesheet, or append them to one, keeping existing rules. Optionally ignore rules declared in elsewhere, matched by a glob pattern.

The purpose of this task is to help automate stylsheet creation. The problem arises when you begin the project with structuring the markup, and on the way you define classes and ids. When there's time to create styles for them, you have to rewrite those selectors.

With stylist, you only have to write these selectors once, and set where those stylesheets should be placed.

The intended usage is with alongside a watch task, so you can just write markup, and have stylist generate the sheets for you.

Stylist also keeps existing sheets, so if you define a new class in a html, the selector will be appended. This way, you can continuously write selectors and have them generated in stylsheets.

Commented code chunks are ignored. Anything between html comments treated as if they weren't even there.