import uuid


def generate_chunk_ids(documents):
    ids = []

    for _ in documents:
        ids.append(str(uuid.uuid4()))

    return ids