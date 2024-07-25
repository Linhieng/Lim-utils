import asyncLimit from './index.js'

const limit = asyncLimit(2)

function fet() {
    const fetchFnArr = []
    const all_props = [
        { url: 'http://localhost:3000?a=1' },
        { url: 'http://localhost:3000?a=2' },
        { url: 'http://localhost:3000?a=3' },
        { url: 'http://localhost:3000?a=4' },
    ]
    all_props.forEach((prop, idx) => {
        fetchFnArr.push(limit.call(
            async () => {
                console.log(`fetching ${prop.url}`)
                const res = await fetch(prop.url)
                if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`)
                const data = await res.text()
                console.log(`✅: ${prop.url}`)
                return idx
            })
        )
    });
    (async () => {
        console.log(await Promise.all(fetchFnArr))
    })()
}
fet()
