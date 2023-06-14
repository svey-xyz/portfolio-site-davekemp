const submitParam:string = "submit"
let successMessage: HTMLElement | null

export const mount = (container: HTMLElement) => {
	successMessage = container.querySelector('#successMessage')
	let submitStatus = new URL(window.location.href).searchParams.get(submitParam)

	if (submitStatus == "success") successMessage?.classList.remove('hidden')
}