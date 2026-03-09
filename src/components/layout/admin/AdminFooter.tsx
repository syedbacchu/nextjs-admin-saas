import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="border-t bg-gray-50 mt-12">
            <div className="container mx-auto px-4 py-10 grid gap-6 md:grid-cols-3">

                {/* Brand */}
                <div>
                    <h3 className="text-lg font-semibold">
                        Admin Panel
                    </h3>
                    <p className="text-sm text-gray-600 mt-2">
                        Keep track of your games with ease, anytime, anywhere.
                    </p>
                </div>

                {/* Links */}
                <div>
                    <h4 className="font-medium mb-2">Quick Links</h4>
                    <ul className="space-y-1 text-sm">
                        <li><Link href="/series">Tournaments</Link></li>
                        <li><Link href="/matches">Matches</Link></li>
                        <li><Link href="/players">Players</Link></li>
                        <li><Link href="/blogs">Blogs</Link></li>
                        <li><Link href="/net-run-rate-calculator">NRR Calculator</Link></li>
                        <li><Link href="/point-table-generator">Point Table Generator</Link></li>
                        <li><Link href="/player-age-calculator">Player Age Calculator</Link></li>
                    </ul>
                </div>

                {/* Info */}
                <div>
                    <h4 className="font-medium mb-2">About</h4>
                    <p className="text-sm text-gray-600">
                        A comprehensive cricket scoring platform that allows
                        ball-by-ball scoring, tournament management, auctions,
                        and player statistics following international standards.
                    </p>
                </div>
            </div>

            <div className="text-center text-sm text-gray-500 py-4 border-t">
                © {new Date().getFullYear()}  All rights reserved.
            </div>
        </footer >
    )
}
