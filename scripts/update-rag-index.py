#!/usr/bin/env python3
"""
scripts/update-rag-index.py

Обновляет локальный Milvus-индекс, который использует MCP-сервер markdown_rag.

Запускать только через scripts/update-rag-index.sh — он делает cd в каталог
MCP-Markdown-RAG и выполняет `uv run python`, чтобы этот файл унаследовал
зависимости MCP-сервера (llama-index, pymilvus, fastembed).
"""
import argparse
import os
import sys

# update-rag-index.sh делает cd в MCP-Markdown-RAG до запуска uv,
# поэтому cwd содержит utils.py из MCP-сервера.
sys.path.insert(0, os.getcwd())

from utils import (  # noqa: E402
    COLLECTION_NAME,
    INDEX_DATA_PATH,
    ensure_collection,
    get_changed_files,
    list_md_files,
    update_tracking_file,
)
from llama_index.core import SimpleDirectoryReader  # noqa: E402
from llama_index.core.node_parser import MarkdownNodeParser  # noqa: E402
from llama_index.core.text_splitter import TokenTextSplitter  # noqa: E402
from pymilvus import MilvusClient, model  # noqa: E402


def main() -> None:
    parser = argparse.ArgumentParser(description="Update markdown_rag index for a directory.")
    parser.add_argument("--target", required=True, help="абсолютный путь к каталогу для индексации")
    parser.add_argument("--force", action="store_true", help="полная переиндексация")
    args = parser.parse_args()

    target = args.target
    if not os.path.isdir(target):
        print(f"target not found: {target}", file=sys.stderr)
        sys.exit(1)

    os.makedirs(INDEX_DATA_PATH, exist_ok=True)
    client = MilvusClient(os.path.join(INDEX_DATA_PATH, "milvus_markdown.db"))
    embedding_fn = model.DefaultEmbeddingFunction()

    if args.force:
        if client.has_collection(COLLECTION_NAME):
            client.drop_collection(COLLECTION_NAME)
        ensure_collection(client)
        files = list_md_files(target, recursive=True)
        if not files:
            print("[markdown_rag] no .md files found in target")
            return
        documents = SimpleDirectoryReader(input_files=files, required_exts=[".md"]).load_data()
        processed = [d.metadata["file_path"] for d in documents]
    else:
        files = get_changed_files(target, recursive=True)
        if not files:
            print("[markdown_rag] index up to date, nothing to do")
            return
        ensure_collection(client)
        for fp in files:
            try:
                client.delete(collection_name=COLLECTION_NAME, filter=f"path == '{fp}'")
            except Exception:
                continue
        documents = SimpleDirectoryReader(input_files=files, required_exts=[".md"]).load_data()
        processed = files

    nodes = MarkdownNodeParser().get_nodes_from_documents(documents)
    chunks = TokenTextSplitter(chunk_size=512, chunk_overlap=100).get_nodes_from_documents(nodes)
    chunks = [n for n in chunks if n.text.strip()]
    if not chunks:
        print("[markdown_rag] no chunks produced (empty files?)")
        return

    vectors = embedding_fn.encode_documents([n.text for n in chunks])
    client.insert(
        collection_name=COLLECTION_NAME,
        data=[
            {
                "vector": v,
                "text": n.text,
                "filename": n.metadata["file_name"],
                "path": n.metadata["file_path"],
            }
            for v, n in zip(vectors, chunks)
        ],
    )
    update_tracking_file(processed)
    mode = "full reindex" if args.force else "incremental update"
    print(f"[markdown_rag] {mode}: {len(processed)} files, {len(chunks)} chunks")


if __name__ == "__main__":
    main()
