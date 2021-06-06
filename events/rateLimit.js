module.exports = (client, rateLimitInfo) => {
	console.log('[WARN] RATE LIMIT:');
	console.log(`[WARN] Timeout: ${rateLimitInfo.timeout}`);
	console.log(`[WARN] Limit: ${rateLimitInfo.limit}`);
	console.log(`[WARN] Method: ${rateLimitInfo.method}`);
	console.log(`[WARN] Path: ${rateLimitInfo.path}`);
	console.log(`[WARN] Route: ${rateLimitInfo.route}`);
};