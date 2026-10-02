window.TREE_CODE_EXAMPLES = {
    node: {
        title: "BST Node Structure",
        explanation:
            "Each node stores one value and two pointers. The left pointer connects to smaller values and the right pointer connects to larger values.",
        code: `#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int data;
    struct Node *left;
    struct Node *right;
} Node;

Node *createNode(int value) {
    Node *newNode = malloc(sizeof(Node));

    newNode->data = value;
    newNode->left = NULL;
    newNode->right = NULL;

    return newNode;
}`
    },

    insert: {
        title: "Insert into a Binary Search Tree",
        explanation:
            "Insertion compares the new value with the current node. A smaller value moves left and a larger value moves right until an empty position is found.",
        code: `Node *insert(Node *root, int value) {
    if (root == NULL) {
        return createNode(value);
    }

    if (value < root->data) {
        root->left = insert(root->left, value);
    }
    else if (value > root->data) {
        root->right = insert(root->right, value);
    }

    return root;
}`
    },

    search: {
        title: "Search in a Binary Search Tree",
        explanation:
            "BST search ignores one entire subtree after each comparison. This makes searching efficient when the tree is balanced.",
        code: `Node *search(Node *root, int target) {
    if (root == NULL || root->data == target) {
        return root;
    }

    if (target < root->data) {
        return search(root->left, target);
    }

    return search(root->right, target);
}`
    },

    delete: {
        title: "Delete from a Binary Search Tree",
        explanation:
            "Deletion has three cases: a leaf node, a node with one child, or a node with two children. For two children, the inorder successor replaces the deleted value.",
        code: `Node *findMin(Node *root) {
    while (root != NULL && root->left != NULL) {
        root = root->left;
    }

    return root;
}

Node *deleteNode(Node *root, int value) {
    if (root == NULL) {
        return NULL;
    }

    if (value < root->data) {
        root->left = deleteNode(root->left, value);
    }
    else if (value > root->data) {
        root->right = deleteNode(root->right, value);
    }
    else {
        if (root->left == NULL) {
            Node *temp = root->right;
            free(root);
            return temp;
        }

        if (root->right == NULL) {
            Node *temp = root->left;
            free(root);
            return temp;
        }

        Node *successor = findMin(root->right);

        root->data = successor->data;

        root->right =
            deleteNode(root->right, successor->data);
    }

    return root;
}`
    },

    traversal: {
        title: "Tree Traversal Algorithms",
        explanation:
            "The position of printf determines the traversal order. Level-order traversal is different because it uses a queue.",
        code: `void preorder(Node *root) {
    if (root == NULL) {
        return;
    }

    printf("%d ", root->data);
    preorder(root->left);
    preorder(root->right);
}

void inorder(Node *root) {
    if (root == NULL) {
        return;
    }

    inorder(root->left);
    printf("%d ", root->data);
    inorder(root->right);
}

void postorder(Node *root) {
    if (root == NULL) {
        return;
    }

    postorder(root->left);
    postorder(root->right);
    printf("%d ", root->data);
}`
    }
};