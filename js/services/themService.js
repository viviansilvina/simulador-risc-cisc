export function initializeTheme() {

    document.body.classList.add(
        "dark-theme"
    );
}

export function toggleTheme() {

    const body =
        document.body;

    if (
        body.classList.contains(
            "dark-theme"
        )
    ) {

        body.classList.remove(
            "dark-theme"
        );

        body.classList.add(
            "light-theme"
        );

        return;
    }

    body.classList.remove(
        "light-theme"
    );

    body.classList.add(
        "dark-theme"
    );
}