import { appendFileSync, mkdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import type {
	ExtensionAPI,
	ExtensionContext,
} from "@earendil-works/pi-coding-agent";

const LOG_DIR = join(homedir(), ".pi", "logs");
const LOG_FILE = join(LOG_DIR, "provider-requests.log");

type NotifyType = "info" | "warning" | "error";

function logToFile(entry: string): void {
	try {
		mkdirSync(LOG_DIR, { recursive: true });
		appendFileSync(LOG_FILE, `${entry}\n`);
	} catch (err) {
		console.error("[pi-provider-logger] failed to write log entry:", err);
	}
}

function formatPayload(payload: unknown): string {
	try {
		// `JSON.stringify` returns `undefined` for `null`/`undefined`; fall back then.
		return JSON.stringify(payload, null, 2) ?? "(none)";
	} catch {
		return String(payload);
	}
}

function formatModel(model: NonNullable<ExtensionContext["model"]>): string {
	return `${model.provider}/${model.id} (${model.api})`;
}

function formatLogEntry(title: string, body: string): string {
	return [title, body, "=".repeat(title.length)].join("\n");
}

function notifyIfUI(
	ctx: ExtensionContext,
	message: string,
	type: NotifyType,
): void {
	if (ctx.hasUI) ctx.ui.notify(message, type);
}

export default function (pi: ExtensionAPI): void {
	pi.on("before_provider_request", (event, ctx) => {
		const model = ctx.model;
		const body = [
			`Time: ${new Date().toISOString()}`,
			`Model api: ${model?.api ?? "unknown"}`,
			`Model baseUrl: ${model?.baseUrl ?? "unknown"}`,
			"",
			"Payload (provider-specific request parameters):",
			formatPayload(event.payload),
		].join("\n");

		logToFile(formatLogEntry("=== PROVIDER REQUEST ===", body));

		notifyIfUI(
			ctx,
			`→ Request: ${model ? formatModel(model) : "unknown model"}`,
			"info",
		);
	});

	pi.on("after_provider_response", (event, ctx) => {
		const headerLines = Object.entries(event.headers).map(
			([k, v]) => `  ${k}: ${v}`,
		);
		const body = [
			`Time: ${new Date().toISOString()}`,
			`Status: ${event.status}`,
			"Headers:",
			...headerLines,
		].join("\n");

		logToFile(formatLogEntry("=== PROVIDER RESPONSE ===", body));

		const type: NotifyType = event.status >= 400 ? "error" : "info";
		notifyIfUI(ctx, `← Response: ${event.status}`, type);
	});
}
