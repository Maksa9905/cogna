import { MantineProvider } from "@mantine/core";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "mobx-tanstack-query/preset";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import Router from "./router";

const rootElement = document.getElementById("root");

if (rootElement) {
	createRoot(rootElement).render(
		<StrictMode>
			<MantineProvider>
				<QueryClientProvider client={queryClient}>
					<BrowserRouter>
						<Router />
					</BrowserRouter>
				</QueryClientProvider>
			</MantineProvider>
		</StrictMode>,
	);
}
