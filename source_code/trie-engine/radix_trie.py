from typing import Dict, Optional, Any

class RadixNode:
    def __init__(self):
        self.children = {}
        self.flags = 0 
        self.meaning_offset = -1

    def set_is_word(self):
        self.flags |= 1
        self.flags &= ~2

    def is_word(self):
        return (self.flags & 1) == 1

    def set_deleted(self):
        self.flags &= ~1
        self.flags |= 2

    def is_deleted(self):
        return (self.flags & 2) == 2

class RadixTrie:
    def __init__(self):
        self.root = RadixNode()

    def insert(self, word: str, offset: int):
        word = word.lower()
        current_node = self.root

        while word:
            match_key = None
            common_prefix = ""

            for key in current_node.children:
                i = 0
                while i < min(len(key), len(word)) and key[i] == word[i]:
                    i += 1

                if i > 0:
                    match_key = key 
                    common_prefix = key[:i]
                    break

            if not match_key:
                new_node = RadixNode()
                new_node.set_is_word()
                new_node.meaning_offset = offset
                current_node.children[word] = new_node
                return  
            elif common_prefix == match_key:
                current_node = current_node.children[match_key]
                word = word[len(common_prefix):]

                if not word:
                    current_node.set_is_word()
                    current_node.meaning_offset = offset
                    return  
            else:
                remaining_key = match_key[len(common_prefix):]
                remaining_word = word[len(common_prefix):]

                child_node = current_node.children.pop(match_key)
                
                split_node = RadixNode()
                current_node.children[common_prefix] = split_node
                split_node.children[remaining_key] = child_node

                if remaining_word:
                    new_leaf = RadixNode()
                    new_leaf.set_is_word()
                    new_leaf.meaning_offset = offset
                    split_node.children[remaining_word] = new_leaf
                else:
                    split_node.set_is_word()
                    split_node.meaning_offset = offset
                return 
            
    def search(self, word: str) -> int:
        word = word.lower()
        current_node = self.root

        while word:
            match_key = None

            for key in current_node.children:
                if word.startswith(key):
                    match_key = key 
                    break

            if not match_key:
                return -1 
            
            current_node = current_node.children[match_key]
            word = word[len(match_key):]
            
        if current_node.is_word() and not current_node.is_deleted():
            return current_node.meaning_offset
        return -1

    def delete(self, word: str) -> bool:
        word = word.lower()
        current_node = self.root

        while word:
            match_key = None

            for key in current_node.children:
                if word.startswith(key):
                    match_key = key 
                    break

            if not match_key:
                return False
            
            current_node = current_node.children[match_key]
            word = word[len(match_key):]
            
        if current_node.is_word():
            current_node.set_deleted()
            return True
        return False
    
    def to_dict(self) -> Dict[str, Any]:
        def _traverse(node, path_label):
            data = {
                "name": path_label if path_label else "root",
                "is_word": node.is_word(),
                "is_deleted": node.is_deleted(),
                "offset": node.meaning_offset if node.is_word() else -1,
                "children": []
            }

            for key, child in node.children.items():
                data["children"].append(_traverse(child, key))
            return data

        return _traverse(self.root, "")