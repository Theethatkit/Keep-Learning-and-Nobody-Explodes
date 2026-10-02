window.HASHMAP_CODE_EXAMPLES = {
    structure: {
        title: "Hash Map Structure",
        explanation:
            "Each bucket stores the first node of a linked list. Entries that collide are connected inside the same bucket.",
        code: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define CAPACITY 7

typedef struct Entry {
    char key[30];
    char value[50];
    struct Entry *next;
} Entry;

Entry *table[CAPACITY] = {NULL};`
    },

    hash: {
        title: "String Hash Function",
        explanation:
            "The function adds the character codes and uses modulo CAPACITY so the final index always stays inside the table.",
        code: `int hashFunction(char key[]) {
    int sum = 0;
    int i;

    for (i = 0; key[i] != '\\0'; i++) {
        sum += key[i];
    }

    return sum % CAPACITY;
}`
    },

    put: {
        title: "Put or Update",
        explanation:
            "Put first searches the selected bucket. If the key already exists, its value is updated. Otherwise, a new entry is inserted into the chain.",
        code: `void put(char key[], char value[]) {
    int index = hashFunction(key);
    Entry *current = table[index];

    while (current != NULL) {
        if (strcmp(current->key, key) == 0) {
            strcpy(current->value, value);
            return;
        }

        current = current->next;
    }

    Entry *newEntry = malloc(sizeof(Entry));

    strcpy(newEntry->key, key);
    strcpy(newEntry->value, value);

    newEntry->next = table[index];
    table[index] = newEntry;
}`
    },

    get: {
        title: "Get a Value",
        explanation:
            "Get hashes the key and only searches the linked list stored in the matching bucket.",
        code: `char *get(char key[]) {
    int index = hashFunction(key);
    Entry *current = table[index];

    while (current != NULL) {
        if (strcmp(current->key, key) == 0) {
            return current->value;
        }

        current = current->next;
    }

    return NULL;
}`
    },

    remove: {
        title: "Remove an Entry",
        explanation:
            "Remove reconnects the chain around the deleted entry. The previous pointer is needed when the target is not the first entry.",
        code: `void removeKey(char key[]) {
    int index = hashFunction(key);

    Entry *current = table[index];
    Entry *previous = NULL;

    while (current != NULL) {
        if (strcmp(current->key, key) == 0) {
            if (previous == NULL) {
                table[index] = current->next;
            }
            else {
                previous->next = current->next;
            }

            free(current);
            return;
        }

        previous = current;
        current = current->next;
    }
}`
    }
};