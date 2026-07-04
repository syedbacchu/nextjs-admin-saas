export type UiTranslationTemplates = {
    create?: (value: string) => string
    update?: (value: string) => string
    save?: (value: string) => string
    add?: (value: string) => string
    details?: (value: string) => string
    management?: (value: string) => string
    search?: (value: string) => string
}

export type UiTranslationBundle = {
    exact: Record<string, string>
    resourceSingular?: Record<string, string>
    resourcePlural?: Record<string, string>
    templates?: UiTranslationTemplates
}
