const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Shared site metadata
const site = {
    brand: 'Soul Deep Yoga Therapy',
    tagline: 'Lisa Segar',
    email: 'souldeepmi@gmail.com',
    nav: [
        { href: '/', label: 'Home', key: 'home' },
        { href: '/about', label: 'About', key: 'about' },
        { href: '/yoga-therapy', label: 'Yoga Therapy', key: 'yoga' },
        { href: '/mushroom-circle', label: 'Mushroom Circle', key: 'mushroom' },
        { href: '/faq', label: 'FAQ', key: 'faq' },
        { href: '/contact', label: 'Contact', key: 'contact' },
    ],
};

// Helper to render a page with the right active nav state + title
function render(res, view, data = {}) {
    res.render(view, { site, ...data });
}

// Routes
app.get('/', (req, res) => {
    render(res, 'index', {
        pageTitle: 'Soul Deep Yoga Therapy — Lisa Segar',
        pageDesc:
            "Soul Deep Yoga Therapy — gentle, trauma-informed yoga therapy and microdosing integration support for women navigating grief, anxiety, and life transitions.",
        active: 'home',
    });
});

app.get('/about', (req, res) => {
    render(res, 'about', {
        pageTitle: 'About — Soul Deep Yoga Therapy',
        pageDesc: "A bit about Lisa Segar, founder of Soul Deep Yoga Therapy.",
        active: 'about',
    });
});

app.get('/yoga-therapy', (req, res) => {
    render(res, 'yoga-therapy', {
        pageTitle: 'Yoga Therapy — Soul Deep Yoga Therapy',
        pageDesc:
            'Functional, trauma-informed yoga therapy and private yoga sessions with Lisa Segar.',
        active: 'yoga',
    });
});

app.get('/mushroom-circle', (req, res) => {
    render(res, 'mushroom-circle', {
        pageTitle: 'The Mushroom Circle — Soul Deep Yoga Therapy',
        pageDesc:
            'A 10-week private healing program for women blending microdosing integration with mindfulness and somatic support.',
        active: 'mushroom',
    });
});

app.get('/faq', (req, res) => {
    render(res, 'faq', {
        pageTitle: 'FAQ — Soul Deep Yoga Therapy',
        pageDesc:
            'Frequently asked questions about yoga therapy, private yoga, and working with Lisa Segar.',
        active: 'faq',
    });
});

app.get('/contact', (req, res) => {
    render(res, 'contact', {
        pageTitle: 'Contact — Soul Deep Yoga Therapy',
        pageDesc:
            'Reach out to Lisa Segar at Soul Deep Yoga Therapy to book a discovery call or ask a question.',
        active: 'contact',
        success: req.query.success === '1',
    });
});

// Contact form handler
app.post('/contact', (req, res) => {
    const { name, email, interest, message } = req.body;

    // Minimal validation
    if (!name || !email) {
        return res.status(400).render('contact', {
            site,
            pageTitle: 'Contact — Soul Deep Yoga Therapy',
            pageDesc: 'Reach out to Lisa Segar.',
            active: 'contact',
            error: 'Please include your name and email so Lisa can reply.',
            formValues: req.body,
            success: false,
        });
    }

    // Log the inquiry — in production this would send an email via SMTP or a service.
    // For now we persist it to stdout so Lisa can still see it when reviewing logs.
    console.log('\n— New Soul Deep inquiry —');
    console.log('Name:     ', name);
    console.log('Email:    ', email);
    console.log('Interest: ', interest || '(none selected)');
    console.log('Message:  ', message || '(no message)');
    console.log('—\n');

    res.redirect('/contact?success=1');
});

// 404 handler
app.use((req, res) => {
    res.status(404).render('404', {
        site,
        pageTitle: 'Not Found — Soul Deep Yoga Therapy',
        pageDesc: 'The page you were looking for could not be found.',
        active: null,
    });
});

app.listen(PORT, () => {
    console.log(`Soul Deep Yoga Therapy listening on http://localhost:${PORT}`);
});
