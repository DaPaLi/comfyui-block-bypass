try:
    from comfy.comfy_types import IO
    any_type = IO.ANY
except ImportError:
    # Fallback für ältere ComfyUI-Versionen
    class AnyType(str):
        def __ne__(self, other):
            return False
    any_type = AnyType("*")


class BlockBypassSwitch:
    """
    Leitet entweder den direkten Eingang (Block überspringen)
    oder den Block-Ausgang weiter — per 1-Klick-Toggle.

    Verkabelung:
      • direct_in  → Signal VOR dem Block
      • block_out  → Signal NACH dem Block
      • bypass     → True = Block überspringen / False = Block aktiv
    """

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "direct_in": (any_type,),
                "block_out":  (any_type,),
                "bypass": ("BOOLEAN", {
                    "default": False,
                    "label_on":  "BYPASS  (Block überspringen)",
                    "label_off": "BLOCK AKTIV",
                }),
            }
        }

    RETURN_TYPES  = (any_type,)
    RETURN_NAMES  = ("output",)
    FUNCTION      = "switch"
    CATEGORY      = "utils/bypass"

    def switch(self, direct_in, block_out, bypass):
        return (direct_in if bypass else block_out,)


NODE_CLASS_MAPPINGS = {
    "BlockBypassSwitch": BlockBypassSwitch,
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "BlockBypassSwitch": "⚡ Block Bypass Switch",
}
