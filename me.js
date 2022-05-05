const client = require('@sendgrid/mail');

client.setApiKey(process.env.SENDGRID_API_KEY);

const message = {
    personalizations: [
        {
            to: [
                {
                    email: 'john_doe@example.com',
                    name: 'John Doe'
                }
            ],
            cc: [
                {
                    email: 'jane_doe@example.com',
                    name: 'Jane Doe'
                }
            ],
            bcc: [
                {
                    email: 'james_doe@example.com',
                    name: 'Jim Doe'
                }
            ]
        },
        {
            from: {
                email: 'sales@example.com',
                name: 'Example Sales Team'
            },
            to: [
                {
                    email: 'janice_doe@example.com',
                    name: 'Janice Doe'
                }
            ],
            bcc: [
                {
                    email: 'jordan_doe@example.com',
                    name: 'Jordan Doe'
                }
            ]
        }
    ],
    from: {
        email: 'orders@example.com',
        name: 'Example Order Confirmation'
    },
    replyTo: {
        email: 'customer_service@example.com',
        name: 'Example Customer Service Team'
    },
    subject: 'Your Example Order Confirmation',
    content: [
        {
            type: 'text/html',
            value: '<p>Hello from Twilio SendGrid!</p><p>Sending with the email service trusted by developers and marketers for <strong>time-savings</strong>, <strong>scalability</strong>, and <strong>delivery expertise</strong>.</p><p>%open-track%</p>'
        }
    ],
    attachments: [
        {
            content: 'PCFET0NUWVBFIGh0bWw+CjxodG1sIGxhbmc9ImVuIj4KCiAgICA8aGVhZD4KICAgICAgICA8bWV0YSBjaGFyc2V0PSJVVEYtOCI+CiAgICAgICAgPG1ldGEgaHR0cC1lcXVpdj0iWC1VQS1Db21wYXRpYmxlIiBjb250ZW50PSJJRT1lZGdlIj4KICAgICAgICA8bWV0YSBuYW1lPSJ2aWV3cG9ydCIgY29udGVudD0id2lkdGg9ZGV2aWNlLXdpZHRoLCBpbml0aWFsLXNjYWxlPTEuMCI+CiAgICAgICAgPHRpdGxlPkRvY3VtZW50PC90aXRsZT4KICAgIDwvaGVhZD4KCiAgICA8Ym9keT4KCiAgICA8L2JvZHk+Cgo8L2h0bWw+Cg==',
            filename: 'index.html',
            type: 'text/html',
            disposition: 'attachment'
        }
    ],
    categories: [
        'cake',
        'pie',
        'baking'
    ],
    sendAt: 1617260400,
    batchId: 'AsdFgHjklQweRTYuIopzXcVBNm0aSDfGHjklmZcVbNMqWert1znmOP2asDFjkl',
    asm: {
        groupId: 12345,
        groupsToDisplay: [
            12345
        ]
    },
    ipPoolName: 'transactional email',
    mailSettings: {
        bypassListManagement: {
            enable: false
        },
        footer: {
            enable: false
        },
        sandboxMode: {
            enable: false
        }
    },
    trackingSettings: {
        clickTracking: {
            enable: true,
            enableText: false
        },
        openTracking: {
            enable: true,
            substitutionTag: '%open-track%'
        },
        subscriptionTracking: {
            enable: false
        }
    }
};

client
    .send(message)
    .then(() => console.log('Mail sent successfully'))
    .catch(error => {
        console.error(error);
    });