import pandas as pd


def convert_csv_to_gzip(file_path: str) -> str:
    output_file_path = "./data/output.csv.gzip"
    df = pd.read_csv(file_path, encoding="ISO-8859-1")
    df.to_csv(output_file_path, index=False, encoding="ISO-8859-1", compression="gzip")

    return output_file_path
