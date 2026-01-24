import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export function ExtensionPrivacyPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            <main className="py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold text-black mb-4">Privacy Policy for Nexbit Demo Builder</h1>
                    <p className="text-gray-600 mb-8">Last Updated: January 24, 2026</p>

                    <div className="prose prose-lg max-w-none">
                        {/* Introduction */}
                        <div className="bg-light-50 rounded-lg p-8 border border-light-200 mb-8">
                            <h2 className="text-2xl font-bold text-black mb-4">Introduction</h2>
                            <p className="text-black">
                                Nexbit Demo Builder ("we," "our," or "the extension"), developed by Logikeon Labs Private Limited, is a Chrome extension that allows users to record and capture DOM interactions on web pages to create interactive product demonstrations. We are committed to protecting your privacy and being transparent about how we collect, use, and protect your data.
                            </p>
                            <p className="text-black mt-4">
                                This privacy policy explains what data we collect, how we use it, and your rights regarding your information.
                            </p>
                        </div>

                        {/* Information We Collect */}
                        <div className="bg-light-50 rounded-lg p-8 border border-light-200 mb-8">
                            <h2 className="text-2xl font-bold text-black mb-4">Information We Collect</h2>

                            <h3 className="text-xl font-semibold text-black mb-3 mt-6">Data Collected During Recording</h3>
                            <p className="text-black mb-3">We only collect data when you explicitly initiate a recording session. During an active recording, we collect:</p>
                            <ul className="space-y-2 text-black">
                                <li>• DOM Snapshots: Complete HTML structure of the web pages you are recording, including visible content, styles, and layout information</li>
                                <li>• User Interactions: Click coordinates, scroll positions, and viewport dimensions during your recording session</li>
                                <li>• Navigation Data: URLs of pages visited during an active recording session</li>
                                <li>• Timestamps: Recording start time and interaction timestamps for playback synchronization</li>
                                <li>• Browser Metadata: Browser type, extension version, screen resolution, and viewport size</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-black mb-3 mt-6">Authentication Data</h3>
                            <p className="text-black mb-3">To provide account functionality, we collect:</p>
                            <ul className="space-y-2 text-black">
                                <li>• Session Tokens: Stytch authentication session JWT and session tokens</li>
                                <li>• User Information: Name and email address provided through Stytch authentication</li>
                                <li>• Organization ID: Your Stytch organization identifier</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-black mb-3 mt-6">Technical Data</h3>
                            <ul className="space-y-2 text-black">
                                <li>• Local Storage: Recording state and authentication tokens stored locally in your browser</li>
                                <li>• Usage Data: Extension installation and basic usage metrics (no personal data)</li>
                            </ul>
                        </div>

                        {/* How We Use Your Information */}
                        <div className="bg-light-50 rounded-lg p-8 border border-light-200 mb-8">
                            <h2 className="text-2xl font-bold text-black mb-4">How We Use Your Information</h2>
                            <p className="text-black mb-3">We use the collected information solely for the following purposes:</p>
                            <ul className="space-y-2 text-black">
                                <li>• Creating Demo Recordings: Processing and storing your recorded sessions to create playable demonstrations</li>
                                <li>• User Authentication: Verifying your identity and maintaining your login session</li>
                                <li>• Service Delivery: Saving recordings to your Nexbit account and enabling playback in the editor</li>
                                <li>• Service Improvement: Analyzing usage patterns to improve extension functionality (aggregated and anonymized data only)</li>
                                <li>• Technical Support: Diagnosing and resolving technical issues when you contact support</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-black mb-3 mt-6">What We DO NOT Do</h3>
                            <ul className="space-y-2 text-black">
                                <li>❌ We DO NOT collect data when the extension is not actively recording</li>
                                <li>❌ We DO NOT use your data for advertising or marketing purposes</li>
                                <li>❌ We DO NOT sell, rent, or share your data with third parties for their commercial purposes</li>
                                <li>❌ We DO NOT track your browsing activity outside of active recording sessions</li>
                                <li>❌ We DO NOT access or read your data for any purpose other than providing the service</li>
                            </ul>
                        </div>

                        {/* Data Storage and Security */}
                        <div className="bg-light-50 rounded-lg p-8 border border-light-200 mb-8">
                            <h2 className="text-2xl font-bold text-black mb-4">Data Storage and Security</h2>

                            <h3 className="text-xl font-semibold text-black mb-3">Where Your Data is Stored</h3>
                            <ul className="space-y-2 text-black">
                                <li>• Recording Data: Stored on Nexbit backend servers at api-studio.nexbit.ai</li>
                                <li>• Authentication Tokens: Stored locally in your browser using Chrome's storage API</li>
                                <li>• Location: Data is processed and stored on secure cloud servers</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-black mb-3 mt-6">Security Measures</h3>
                            <p className="text-black mb-3">We implement industry-standard security measures including:</p>
                            <ul className="space-y-2 text-black">
                                <li>• HTTPS encryption for all data transmission</li>
                                <li>• Secure token-based authentication using Stytch</li>
                                <li>• Access controls limiting data access to authorized personnel only</li>
                                <li>• Regular security audits and updates</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-black mb-3 mt-6">Data Retention</h3>
                            <ul className="space-y-2 text-black">
                                <li>• Recording Data: Recordings are stored until you delete them from your account</li>
                                <li>• Authentication Data: Session tokens expire according to Stytch's security policies</li>
                                <li>• Account Data: Retained as long as your account is active</li>
                                <li>• Deleted Data: Permanently removed from our servers within 30 days of deletion</li>
                            </ul>
                        </div>

                        {/* Data Sharing */}
                        <div className="bg-light-50 rounded-lg p-8 border border-light-200 mb-8">
                            <h2 className="text-2xl font-bold text-black mb-4">Data Sharing and Third Parties</h2>
                            <p className="text-black mb-3">
                                We do not sell, trade, or transfer your data to third parties. We may share data only in the following limited circumstances:
                            </p>
                            <ul className="space-y-2 text-black">
                                <li>• Service Providers: Stytch for authentication (subject to their privacy policy)</li>
                                <li>• Legal Requirements: When required by law, court order, or to protect our legal rights</li>
                                <li>• Business Transfers: In the event of a merger or acquisition, with prior user consent</li>
                                <li>• Security Protection: To prevent fraud, abuse, or security threats</li>
                            </ul>
                            <p className="text-black mt-3">
                                All third-party services we use are required to maintain the confidentiality and security of your data.
                            </p>
                        </div>

                        {/* Your Rights */}
                        <div className="bg-light-50 rounded-lg p-8 border border-light-200 mb-8">
                            <h2 className="text-2xl font-bold text-black mb-4">Your Rights and Choices</h2>
                            <p className="text-black mb-3">You have the following rights regarding your data:</p>

                            <h3 className="text-xl font-semibold text-black mb-3 mt-6">Access and Portability</h3>
                            <ul className="space-y-2 text-black">
                                <li>• View all your recordings through the Nexbit dashboard</li>
                                <li>• Export your recordings in standard formats</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-black mb-3 mt-6">Deletion</h3>
                            <ul className="space-y-2 text-black">
                                <li>• Delete individual recordings at any time through the Nexbit interface</li>
                                <li>• Request complete account deletion by contacting us</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-black mb-3 mt-6">Correction</h3>
                            <ul className="space-y-2 text-black">
                                <li>• Update your account information through your Nexbit account settings</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-black mb-3 mt-6">Withdrawal of Consent</h3>
                            <ul className="space-y-2 text-black">
                                <li>• Uninstall the extension at any time to stop all data collection</li>
                                <li>• Log out to clear local authentication data</li>
                            </ul>
                        </div>

                        {/* Chrome Permissions */}
                        <div className="bg-light-50 rounded-lg p-8 border border-light-200 mb-8">
                            <h2 className="text-2xl font-bold text-black mb-4">Chrome Extension Permissions</h2>
                            <p className="text-black mb-4">The extension requests the following permissions, which are used only as described:</p>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl font-semibold text-black mb-2">activeTab Permission</h3>
                                    <p className="text-black"><strong>Why we need it:</strong> To capture DOM snapshots of the currently active tab when you explicitly start a recording session.</p>
                                    <p className="text-black mt-2"><strong>What we do:</strong> Read the visible HTML, CSS, and page structure of tabs you choose to record.</p>
                                    <p className="text-black mt-2"><strong>What we don't do:</strong> Access tabs you're not recording, read sensitive form data, or track your browsing.</p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-black mb-2">storage Permission</h3>
                                    <p className="text-black"><strong>Why we need it:</strong> To store recording state and authentication tokens locally in your browser.</p>
                                    <p className="text-black mt-2"><strong>What we do:</strong> Save your login session and maintain recording state across browser sessions.</p>
                                    <p className="text-black mt-2"><strong>What we don't do:</strong> Access or transmit this data except to authenticate with our servers.</p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-black mb-2">Content Scripts on &lt;all_urls&gt;</h3>
                                    <p className="text-black"><strong>Why we need it:</strong> To enable recording functionality on any website you choose to record.</p>
                                    <p className="text-black mt-2"><strong>What we do:</strong> Inject recording listeners only when you explicitly start a recording session.</p>
                                    <p className="text-black mt-2"><strong>What we don't do:</strong> Run scripts or collect data on pages where you haven't started recording.</p>
                                </div>

                                <div>
                                    <h3 className="text-xl font-semibold text-black mb-2">Content Scripts on Nexbit Domains</h3>
                                    <p className="text-black"><strong>Why we need it:</strong> To sync your login session between the web app and extension.</p>
                                    <p className="text-black mt-2"><strong>What we do:</strong> Read authentication cookies from studio.nexbit.ai to keep you logged in.</p>
                                    <p className="text-black mt-2"><strong>What we don't do:</strong> Access cookies from other websites or share your credentials.</p>
                                </div>
                            </div>
                        </div>

                        {/* Chrome Web Store Compliance */}
                        <div className="bg-light-50 rounded-lg p-8 border border-light-200 mb-8">
                            <h2 className="text-2xl font-bold text-black mb-4">Chrome Web Store Limited Use Compliance</h2>
                            <p className="text-black mb-3">This extension complies with the Chrome Web Store's Limited Use policy:</p>
                            <ul className="space-y-2 text-black">
                                <li>• We collect user data only for the single purpose of creating and storing demo recordings</li>
                                <li>• We do not use data for personalized advertising</li>
                                <li>• We do not sell or transfer user data to third parties (except as required by law)</li>
                                <li>• We do not use data for creditworthiness or lending purposes</li>
                                <li>• Human access to user data is limited to debugging and support with explicit user consent</li>
                            </ul>
                        </div>

                        {/* Children's Privacy */}
                        <div className="bg-light-50 rounded-lg p-8 border border-light-200 mb-8">
                            <h2 className="text-2xl font-bold text-black mb-4">Children's Privacy</h2>
                            <p className="text-black">
                                Our service is not directed to individuals under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that a child under 13 has provided us with personal information, we will take steps to delete such information.
                            </p>
                        </div>

                        {/* International Users */}
                        <div className="bg-light-50 rounded-lg p-8 border border-light-200 mb-8">
                            <h2 className="text-2xl font-bold text-black mb-4">International Users</h2>
                            <p className="text-black">
                                If you are accessing our service from outside the United States, please be aware that your information may be transferred to, stored, and processed in the United States and other countries where our servers are located. By using our service, you consent to this transfer.
                            </p>
                        </div>

                        {/* Policy Changes */}
                        <div className="bg-light-50 rounded-lg p-8 border border-light-200 mb-8">
                            <h2 className="text-2xl font-bold text-black mb-4">Changes to This Privacy Policy</h2>
                            <p className="text-black mb-3">
                                We may update this privacy policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons. When we make changes:
                            </p>
                            <ul className="space-y-2 text-black">
                                <li>• We will update the "Last Updated" date at the top of this policy</li>
                                <li>• For material changes, we may notify you via email or through the extension</li>
                                <li>• Continued use of the extension after changes constitutes acceptance of the updated policy</li>
                            </ul>
                            <p className="text-black mt-3">
                                We encourage you to review this policy periodically.
                            </p>
                        </div>

                        {/* Contact */}
                        <div className="bg-light-50 rounded-lg p-8 border border-light-200 mb-8">
                            <h2 className="text-2xl font-bold text-black mb-4">Contact Us</h2>
                            <p className="text-black mb-3">
                                If you have questions, concerns, or requests regarding this privacy policy or our data practices, please contact us:
                            </p>
                            <ul className="space-y-2 text-black">
                                <li>• <strong>Email:</strong> founder@nexbit.ai</li>
                                <li>• <strong>Website:</strong> <a href="https://nexbit.ai" className="text-primary-600 hover:text-primary-700">https://nexbit.ai</a></li>
                                <li>• <strong>Support:</strong> founder@nexbit.ai</li>
                            </ul>
                            <p className="text-black mt-4">
                                For privacy-specific inquiries or to exercise your data rights, please include "Privacy Request" in your email subject line.
                            </p>
                        </div>

                        {/* Legal Compliance */}
                        <div className="bg-light-50 rounded-lg p-8 border border-light-200">
                            <h2 className="text-2xl font-bold text-black mb-4">Legal Compliance</h2>
                            <p className="text-black mb-3">This privacy policy is designed to comply with:</p>
                            <ul className="space-y-2 text-black">
                                <li>• General Data Protection Regulation (GDPR) for European users</li>
                                <li>• California Consumer Privacy Act (CCPA) for California residents</li>
                                <li>• Chrome Web Store Developer Program Policies</li>
                                <li>• Other applicable data protection laws</li>
                            </ul>
                            <p className="text-black mt-4">
                                If you are in the European Economic Area (EEA) or California, you may have additional rights under GDPR or CCPA. Please contact us to exercise these rights.
                            </p>
                        </div>

                        {/* Footer Info */}
                        <div className="mt-8 pt-8 border-t border-light-200">
                            <p className="text-gray-600 text-sm">
                                <strong>Developer:</strong> Nexbit Team<br />
                                <strong>Extension Name:</strong> Nexbit Demo Builder<br />
                                <strong>Version:</strong> 0.0.1<br />
                                <strong>Privacy Policy Version:</strong> 1.0
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
