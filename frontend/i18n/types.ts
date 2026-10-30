import type es from './locales/es'

type TranslationKeys<Value, Prefix extends string = ''> = {
  [Key in keyof Value]: Key extends string | number
    ? Value[Key] extends object
      ? TranslationKeys<Value[Key], `${Prefix}${Key}.`>
      : `${Prefix}${Key}`
    : never
}[keyof Value]

export type TranslationKey = TranslationKeys<typeof es>

type TranslationResourceShape<Value> = {
  [Key in keyof Value]: Value[Key] extends object ? TranslationResourceShape<Value[Key]> : string
}

export type TranslationResource = TranslationResourceShape<typeof es>
