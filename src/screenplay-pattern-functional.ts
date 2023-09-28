import { toPromise } from "./screenplay-pattern";

export type AbilityType<T> = (...args: unknown[]) => T;
export type InteractionType = (actor: ActorType) => Promise<unknown>;
export type TaskType = (actor: ActorType) => Promise<unknown>;
export type QuestionType<T> = (actor: ActorType) => Promise<T>;

export interface ActorType {
  abilities?: AbilityType<unknown>[];
}

export const createActor = (abilities?: AbilityType<unknown>[]): ActorType => ({
  abilities,
});

export const useAbility = async <T>(
  actor: ActorType,
  ability: AbilityType<T>,
  ...args: unknown[]
): Promise<T> => {
  const matchingAbilities = actor.abilities?.filter((a) => a === ability);
  if (matchingAbilities && matchingAbilities.length > 0) {
    return (matchingAbilities[0] as AbilityType<T>)(...args);
  } else {
    throw new Error(`Actor does not have the specified ability.`);
  }
};

export const performs = async (
  actor: ActorType,
  taskOrInteraction: TaskType | InteractionType,
): Promise<unknown> => {
  return await taskOrInteraction(actor);
};

export const asserts = async <T>(
  actor: ActorType,
  question: QuestionType<T>,
  assert: (answer: T) => void,
): Promise<void> => {
  await toPromise(assert(await question(actor)));
};

export const asksAbout = async <T>(
  actor: ActorType,
  question: QuestionType<T>,
): Promise<T> => {
  return await question(actor);
};
