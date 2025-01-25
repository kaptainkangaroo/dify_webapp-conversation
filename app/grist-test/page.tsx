export default function GristTestPage() {
    return new Response(
        `<!DOCTYPE html>
        <html>
            <head>
                <meta http-equiv="refresh" content="0;url=/grist-test.html" />
            </head>
        </html>`,
        {
            headers: {
                'Content-Type': 'text/html',
            },
        }
    );
}
