

export async function POST({ request }) {
    const headers = Object.fromEntries(request.headers.entries());
    const data = await request.json();

    return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" }
    });
}
