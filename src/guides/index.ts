// Every guide definition. Reading order and numbering come from the registry.
import type { GuideDef } from '../shell/guide';
import aiBehaviouralTest from './ai-behavioural-test';
import aiFunctionalTest from './ai-functional-test';
import context from './context';
import functionalTest from './functional-test';
import gameplayLibrary from './gameplay-library';
import oracle from './oracle';
import radiologist from './radiologist';
import userTest from './user-test';

export const guides: GuideDef[] = [gameplayLibrary, userTest, functionalTest, aiBehaviouralTest, aiFunctionalTest, oracle, radiologist, context];
